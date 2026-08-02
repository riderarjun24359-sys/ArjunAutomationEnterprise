import {
    buildAccessGrantPayload,
    buildApprovalPayload,
    buildCrossModuleLinks,
    buildDocumentAuditPayload,
    buildDocumentPayload,
    buildDocumentReport,
    buildDocumentsDashboardStats,
    buildEsignPayload,
    buildFolderPayload,
    buildLookupMaps,
    buildRetentionPolicyPayload,
    buildSharePayload,
    buildTagLinkPayload,
    buildTagPayload,
    buildTemplatePayload,
    buildUpdateApprovalPayload,
    buildUpdateArchivePayload,
    buildVersionPayload,
    getTagNamesForDocument,
    mapAccessGrantSummary,
    mapActivityLogSummary,
    mapApprovalSummary,
    mapArchiveSummary,
    mapAuditEntry,
    mapDocumentSummary,
    mapEsignSummary,
    mapFolderSummary,
    mapPreviewSummary,
    mapRetentionPolicySummary,
    mapSearchIndexSummary,
    mapShareSummary,
    mapTagSummary,
    mapTemplateSummary,
    mapVersionSummary,
} from "@/src/modules/database/lib/documents-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    AccessGrantSummary,
    ActivityLogSummary,
    ApprovalSummary,
    ArchiveSummary,
    CreateAccessGrantInput,
    CreateApprovalInput,
    CreateDocumentInput,
    CreateEsignInput,
    CreateFolderInput,
    CreateRetentionPolicyInput,
    CreateShareInput,
    CreateTagInput,
    CreateTemplateInput,
    CreateVersionInput,
    CrossModuleLinks,
    DocumentAuditEntry,
    DocumentReport,
    DocumentSummary,
    DocumentsDashboardStats,
    EsignSummary,
    FolderSummary,
    PreviewSummary,
    RetentionPolicySummary,
    SearchIndexSummary,
    ShareSummary,
    TagSummary,
    TemplateSummary,
    UpdateApprovalStatusInput,
    UpdateArchiveRestoreInput,
    UpdateEsignStatusInput,
    VersionSummary,
} from "@/src/modules/documents/types";

export class DocumentsService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [folders, documents, tags, clients, projects, employees, invoices, purchaseOrders, supportTickets, salesOpportunities] = await Promise.all([
            databaseService.documentFolders.listByOrganization(organizationId),
            databaseService.documents.listByOrganization(organizationId),
            databaseService.documentTags.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.employees.listByOrganization(organizationId),
            databaseService.invoices.listByOrganization(organizationId),
            databaseService.purchaseOrders.listByOrganization(organizationId),
            databaseService.supportTickets.listByOrganization(organizationId),
            databaseService.salesOpportunities.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(folders, documents, tags, clients, projects, employees, invoices, purchaseOrders, supportTickets, salesOpportunities);
    }

    private async getTagLinks(organizationId: string) {
        const documents = await databaseService.documents.listByOrganization(organizationId);
        return databaseService.documentTagLinks.listByDocumentIds(documents.map((doc) => doc.id));
    }

    async getFolders(authUserId: string, email: string, fullName?: string | null): Promise<FolderSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [folders, documents] = await Promise.all([
            databaseService.documentFolders.listByOrganization(context.organizationId),
            databaseService.documents.listByOrganization(context.organizationId),
        ]);
        const maps = buildLookupMaps(folders, documents, [], [], [], [], [], [], [], []);
        return folders.map((folder) => mapFolderSummary(folder, maps, documents.filter((doc) => doc.folder_id === folder.id).length, folders.filter((item) => item.parent_folder_id === folder.id).length));
    }

    async createFolder(authUserId: string, email: string, input: CreateFolderInput, fullName?: string | null): Promise<FolderSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documentFolders.create(buildFolderPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create folder");
        await databaseService.documentAuditLogs.create(buildDocumentAuditPayload(context.organizationId, "folder", "create", `Folder ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFolderSummary(created, maps, 0, 0);
    }

    async getDocuments(authUserId: string, email: string, fullName?: string | null): Promise<DocumentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        const tagLinks = await this.getTagLinks(context.organizationId);
        const documents = await databaseService.documents.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" });
        return documents.map((doc) => mapDocumentSummary(doc, maps, getTagNamesForDocument(doc.id, tagLinks, maps)));
    }

    async createDocument(authUserId: string, email: string, input: CreateDocumentInput, fullName?: string | null): Promise<DocumentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documents.create(buildDocumentPayload(context.organizationId, context.profileId, input));
        if (!created) throw new Error("Failed to create document");
        await databaseService.documentActivityLogs.create({ organization_id: context.organizationId, document_id: created.id, activity_type: "upload", summary: `Document uploaded: ${created.title}` });
        await databaseService.documentAuditLogs.create(buildDocumentAuditPayload(context.organizationId, "document", "create", `Document ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDocumentSummary(created, maps, []);
    }

    async getTags(authUserId: string, email: string, fullName?: string | null): Promise<TagSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [tags, tagLinks] = await Promise.all([
            databaseService.documentTags.listByOrganization(context.organizationId),
            this.getTagLinks(context.organizationId),
        ]);
        return tags.map((tag) => mapTagSummary(tag, tagLinks.filter((link) => link.tag_id === tag.id).length));
    }

    async createTag(authUserId: string, email: string, input: CreateTagInput, fullName?: string | null): Promise<TagSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documentTags.create(buildTagPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create tag");
        if (input.documentId) {
            await databaseService.documentTagLinks.create(buildTagLinkPayload(input.documentId, created.id));
        }
        return mapTagSummary(created, input.documentId ? 1 : 0);
    }

    async getVersions(authUserId: string, email: string, fullName?: string | null): Promise<VersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.documentVersions.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((version) => mapVersionSummary(version, maps));
    }

    async createVersion(authUserId: string, email: string, input: CreateVersionInput, fullName?: string | null): Promise<VersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documentVersions.create(buildVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create version");
        await databaseService.documents.update(input.documentId, { current_version: input.versionNumber, file_url: input.fileUrl, file_size: input.fileSize });
        await databaseService.documentActivityLogs.create({ organization_id: context.organizationId, document_id: input.documentId, activity_type: "version", summary: `Version ${input.versionNumber} uploaded` });
        const maps = await this.getMaps(context.organizationId);
        return mapVersionSummary(created, maps);
    }

    async getApprovals(authUserId: string, email: string, fullName?: string | null): Promise<ApprovalSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.documentApprovals.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((approval) => mapApprovalSummary(approval, maps));
    }

    async createApproval(authUserId: string, email: string, input: CreateApprovalInput, fullName?: string | null): Promise<ApprovalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documentApprovals.create(buildApprovalPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create approval");
        const maps = await this.getMaps(context.organizationId);
        return mapApprovalSummary(created, maps);
    }

    async updateApprovalStatus(authUserId: string, email: string, approvalId: string, input: UpdateApprovalStatusInput, fullName?: string | null): Promise<ApprovalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.documentApprovals.update(approvalId, buildUpdateApprovalPayload(input));
        if (!updated) throw new Error("Failed to update approval");
        if (input.status === "approved") {
            await databaseService.documentActivityLogs.create({ organization_id: context.organizationId, document_id: updated.document_id, activity_type: "approval", summary: "Document approved" });
        }
        const maps = await this.getMaps(context.organizationId);
        return mapApprovalSummary(updated, maps);
    }

    async getEsignPreparations(authUserId: string, email: string, fullName?: string | null): Promise<EsignSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.documentEsignPreparations.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((item) => mapEsignSummary(item, maps));
    }

    async createEsignPreparation(authUserId: string, email: string, input: CreateEsignInput, fullName?: string | null): Promise<EsignSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documentEsignPreparations.create(buildEsignPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create e-signature preparation");
        const maps = await this.getMaps(context.organizationId);
        return mapEsignSummary(created, maps);
    }

    async updateEsignStatus(authUserId: string, email: string, esignId: string, input: UpdateEsignStatusInput, fullName?: string | null): Promise<EsignSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.documentEsignPreparations.update(esignId, {
            status: input.status,
            sent_at: input.status === "sent" ? new Date().toISOString() : null,
        });
        if (!updated) throw new Error("Failed to update e-signature preparation");
        const maps = await this.getMaps(context.organizationId);
        return mapEsignSummary(updated, maps);
    }

    async getShares(authUserId: string, email: string, fullName?: string | null): Promise<ShareSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.documentShares.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((share) => mapShareSummary(share, maps));
    }

    async createShare(authUserId: string, email: string, input: CreateShareInput, fullName?: string | null): Promise<ShareSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documentShares.create(buildSharePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create share");
        await databaseService.documentActivityLogs.create({ organization_id: context.organizationId, document_id: input.documentId, activity_type: "share", summary: `Document shared with ${input.recipientEmail}` });
        const maps = await this.getMaps(context.organizationId);
        return mapShareSummary(created, maps);
    }

    async getAccessGrants(authUserId: string, email: string, fullName?: string | null): Promise<AccessGrantSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.documentAccessGrants.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((grant) => mapAccessGrantSummary(grant, maps));
    }

    async createAccessGrant(authUserId: string, email: string, input: CreateAccessGrantInput, fullName?: string | null): Promise<AccessGrantSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documentAccessGrants.create(buildAccessGrantPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create access grant");
        const maps = await this.getMaps(context.organizationId);
        return mapAccessGrantSummary(created, maps);
    }

    async getTemplates(authUserId: string, email: string, fullName?: string | null): Promise<TemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.documentTemplates.listByOrganization(context.organizationId)).map(mapTemplateSummary);
    }

    async createTemplate(authUserId: string, email: string, input: CreateTemplateInput, fullName?: string | null): Promise<TemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documentTemplates.create(buildTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create template");
        return mapTemplateSummary(created);
    }

    async getPreviews(authUserId: string, email: string, fullName?: string | null): Promise<PreviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.documentPreviews.listByOrganization(context.organizationId, { orderBy: "generated_at", orderDirection: "desc" })).map((preview) => mapPreviewSummary(preview, maps));
    }

    async getSearchIndex(authUserId: string, email: string, fullName?: string | null): Promise<SearchIndexSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.documentSearchIndex.listByOrganization(context.organizationId, { orderBy: "indexed_at", orderDirection: "desc" })).map((entry) => mapSearchIndexSummary(entry, maps));
    }

    async getRetentionPolicies(authUserId: string, email: string, fullName?: string | null): Promise<RetentionPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.documentRetentionPolicies.listByOrganization(context.organizationId)).map(mapRetentionPolicySummary);
    }

    async createRetentionPolicy(authUserId: string, email: string, input: CreateRetentionPolicyInput, fullName?: string | null): Promise<RetentionPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.documentRetentionPolicies.create(buildRetentionPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create retention policy");
        return mapRetentionPolicySummary(created);
    }

    async getArchives(authUserId: string, email: string, fullName?: string | null): Promise<ArchiveSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.documentArchives.listByOrganization(context.organizationId, { orderBy: "archived_at", orderDirection: "desc" })).map((archive) => mapArchiveSummary(archive, maps));
    }

    async updateArchiveRestore(authUserId: string, email: string, archiveId: string, input: UpdateArchiveRestoreInput, fullName?: string | null): Promise<ArchiveSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const updated = await databaseService.documentArchives.update(archiveId, buildUpdateArchivePayload(input));
        if (!updated) throw new Error("Failed to update archive");
        const maps = await this.getMaps(context.organizationId);
        return mapArchiveSummary(updated, maps);
    }

    async getActivityLogs(authUserId: string, email: string, fullName?: string | null): Promise<ActivityLogSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.documentActivityLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((log) => mapActivityLogSummary(log, maps));
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<DocumentAuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.documentAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getReport(authUserId: string, email: string, fullName?: string | null): Promise<DocumentReport> {
        const [documents, folders, approvals, activityLogs] = await Promise.all([
            this.getDocuments(authUserId, email, fullName),
            this.getFolders(authUserId, email, fullName),
            this.getApprovals(authUserId, email, fullName),
            this.getActivityLogs(authUserId, email, fullName),
        ]);
        return buildDocumentReport({ documents, folders, approvals, activityLogs });
    }

    async getCrossModuleLinks(authUserId: string, email: string, fullName?: string | null): Promise<CrossModuleLinks> {
        const documents = await this.getDocuments(authUserId, email, fullName);
        return buildCrossModuleLinks({ documents });
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<DocumentsDashboardStats> {
        const [documents, folders, tags, approvals, shares, archives, templates] = await Promise.all([
            this.getDocuments(authUserId, email, fullName),
            this.getFolders(authUserId, email, fullName),
            this.getTags(authUserId, email, fullName),
            this.getApprovals(authUserId, email, fullName),
            this.getShares(authUserId, email, fullName),
            this.getArchives(authUserId, email, fullName),
            this.getTemplates(authUserId, email, fullName),
        ]);
        return buildDocumentsDashboardStats({ documents, folders, tags, approvals, shares, archives, templates });
    }

    async getFolderOptions(authUserId: string, email: string, fullName?: string | null): Promise<Array<{ id: string; name: string }>> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.documentFolders.listByOrganization(context.organizationId)).map((folder) => ({ id: folder.id, name: folder.name }));
    }

    async getDocumentOptions(authUserId: string, email: string, fullName?: string | null): Promise<Array<{ id: string; name: string }>> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.documents.listByOrganization(context.organizationId)).map((doc) => ({ id: doc.id, name: doc.title }));
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null): Promise<Array<{ id: string; name: string }>> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.clients.listByOrganization(context.organizationId)).map((client) => ({ id: client.id, name: client.name }));
    }

    async getEmployeeOptions(authUserId: string, email: string, fullName?: string | null): Promise<Array<{ id: string; name: string }>> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.employees.listByOrganization(context.organizationId)).map((employee) => ({ id: employee.id, name: `${employee.first_name} ${employee.last_name}` }));
    }
}

export const documentsService = new DocumentsService();
