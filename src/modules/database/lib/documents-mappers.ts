import type {
    DbClient,
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
    DbEmployee,
    DbInvoice,
    DbProject,
    DbPurchaseOrder,
    DbSalesOpportunity,
    DbSupportTicket,
} from "@/src/modules/database/types/platform";
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
    VersionSummary,
} from "@/src/modules/documents/types";

type LookupMaps = {
    folders: Map<string, DbDocumentFolder>;
    documents: Map<string, DbDocument>;
    tags: Map<string, DbDocumentTag>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    employees: Map<string, DbEmployee>;
    invoices: Map<string, DbInvoice>;
    purchaseOrders: Map<string, DbPurchaseOrder>;
    supportTickets: Map<string, DbSupportTicket>;
    salesOpportunities: Map<string, DbSalesOpportunity>;
};

export const buildLookupMaps = (
    folders: DbDocumentFolder[],
    documents: DbDocument[],
    tags: DbDocumentTag[],
    clients: DbClient[],
    projects: DbProject[],
    employees: DbEmployee[],
    invoices: DbInvoice[],
    purchaseOrders: DbPurchaseOrder[],
    supportTickets: DbSupportTicket[],
    salesOpportunities: DbSalesOpportunity[],
): LookupMaps => ({
    folders: new Map(folders.map((item) => [item.id, item])),
    documents: new Map(documents.map((item) => [item.id, item])),
    tags: new Map(tags.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    employees: new Map(employees.map((item) => [item.id, item])),
    invoices: new Map(invoices.map((item) => [item.id, item])),
    purchaseOrders: new Map(purchaseOrders.map((item) => [item.id, item])),
    supportTickets: new Map(supportTickets.map((item) => [item.id, item])),
    salesOpportunities: new Map(salesOpportunities.map((item) => [item.id, item])),
});

const employeeName = (maps: LookupMaps, id?: string | null) => {
    if (!id) return null;
    const employee = maps.employees.get(id);
    return employee ? `${employee.first_name} ${employee.last_name}` : null;
};

export const mapFolderSummary = (record: DbDocumentFolder, maps: LookupMaps, documentCount: number, childCount: number): FolderSummary => ({
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    parentFolderName: record.parent_folder_id ? maps.folders.get(record.parent_folder_id)?.name ?? null : null,
    documentCount,
    childFolderCount: childCount,
});

export const mapDocumentSummary = (record: DbDocument, maps: LookupMaps, tagNames: string[]): DocumentSummary => ({
    id: record.id,
    title: record.title,
    fileName: record.file_name,
    fileUrl: record.file_url,
    mimeType: record.mime_type,
    fileSize: record.file_size,
    status: record.status,
    currentVersion: record.current_version,
    folderName: record.folder_id ? maps.folders.get(record.folder_id)?.name ?? null : null,
    clientName: record.client_id ? maps.clients.get(record.client_id)?.name ?? null : null,
    projectName: record.project_id ? maps.projects.get(record.project_id)?.name ?? null : null,
    employeeName: employeeName(maps, record.employee_id),
    invoiceNumber: record.invoice_id ? maps.invoices.get(record.invoice_id)?.number ?? null : null,
    purchaseOrderNumber: record.purchase_order_id ? maps.purchaseOrders.get(record.purchase_order_id)?.po_number ?? null : null,
    supportTicketNumber: record.support_ticket_id ? maps.supportTickets.get(record.support_ticket_id)?.ticket_number ?? null : null,
    salesOpportunityName: record.sales_opportunity_id ? maps.salesOpportunities.get(record.sales_opportunity_id)?.name ?? null : null,
    tags: tagNames,
    createdAt: record.created_at,
});

export const mapTagSummary = (record: DbDocumentTag, documentCount: number): TagSummary => ({
    id: record.id,
    name: record.name,
    color: record.color,
    documentCount,
});

export const mapVersionSummary = (record: DbDocumentVersion, maps: LookupMaps): VersionSummary => ({
    id: record.id,
    documentTitle: maps.documents.get(record.document_id)?.title ?? "Unknown",
    versionNumber: record.version_number,
    fileUrl: record.file_url,
    fileSize: record.file_size,
    changeSummary: record.change_summary,
    createdAt: record.created_at,
});

export const mapApprovalSummary = (record: DbDocumentApproval, maps: LookupMaps): ApprovalSummary => ({
    id: record.id,
    documentTitle: maps.documents.get(record.document_id)?.title ?? "Unknown",
    approverName: employeeName(maps, record.approver_id),
    status: record.status,
    comments: record.comments,
    decidedAt: record.decided_at ?? null,
    createdAt: record.created_at,
});

export const mapEsignSummary = (record: DbDocumentEsignPreparation, maps: LookupMaps): EsignSummary => ({
    id: record.id,
    documentTitle: maps.documents.get(record.document_id)?.title ?? "Unknown",
    signerName: record.signer_name,
    signerEmail: record.signer_email,
    status: record.status,
    sentAt: record.sent_at ?? null,
    preparedAt: record.prepared_at,
});

export const mapShareSummary = (record: DbDocumentShare, maps: LookupMaps): ShareSummary => ({
    id: record.id,
    documentTitle: maps.documents.get(record.document_id)?.title ?? "Unknown",
    shareToken: record.share_token,
    recipientEmail: record.recipient_email,
    permissionLevel: record.permission_level,
    expiresAt: record.expires_at ?? null,
    isActive: record.is_active,
    createdAt: record.created_at,
});

export const mapAccessGrantSummary = (record: DbDocumentAccessGrant, maps: LookupMaps): AccessGrantSummary => ({
    id: record.id,
    documentTitle: record.document_id ? maps.documents.get(record.document_id)?.title ?? null : null,
    folderName: record.folder_id ? maps.folders.get(record.folder_id)?.name ?? null : null,
    granteeType: record.grantee_type,
    granteeName: record.grantee_id ? employeeName(maps, record.grantee_id) : null,
    permissionLevel: record.permission_level,
    createdAt: record.created_at,
});

export const mapTemplateSummary = (record: DbDocumentTemplate): TemplateSummary => ({
    id: record.id,
    name: record.name,
    category: record.category,
    description: record.description,
    status: record.status,
    contentPreview: record.template_content.slice(0, 120),
});

export const mapPreviewSummary = (record: DbDocumentPreview, maps: LookupMaps): PreviewSummary => ({
    id: record.id,
    documentTitle: maps.documents.get(record.document_id)?.title ?? "Unknown",
    previewType: record.preview_type,
    previewUrl: record.preview_url,
    pageCount: record.page_count,
    generatedAt: record.generated_at,
});

export const mapSearchIndexSummary = (record: DbDocumentSearchIndex, maps: LookupMaps): SearchIndexSummary => ({
    id: record.id,
    documentTitle: maps.documents.get(record.document_id)?.title ?? "Unknown",
    searchText: record.search_text,
    indexedAt: record.indexed_at,
});

export const mapRetentionPolicySummary = (record: DbDocumentRetentionPolicy): RetentionPolicySummary => ({
    id: record.id,
    name: record.name,
    retentionDays: record.retention_days,
    actionOnExpiry: record.action_on_expiry,
    appliesToCategory: record.applies_to_category,
    isActive: record.is_active,
});

export const mapArchiveSummary = (record: DbDocumentArchive, maps: LookupMaps): ArchiveSummary => ({
    id: record.id,
    documentTitle: maps.documents.get(record.document_id)?.title ?? "Unknown",
    archivedAt: record.archived_at,
    restoreAvailable: record.restore_available,
});

export const mapActivityLogSummary = (record: DbDocumentActivityLog, maps: LookupMaps): ActivityLogSummary => ({
    id: record.id,
    documentTitle: record.document_id ? maps.documents.get(record.document_id)?.title ?? null : null,
    activityType: record.activity_type,
    summary: record.summary,
    createdAt: record.created_at,
});

export const mapAuditEntry = (record: DbDocumentAuditLog): DocumentAuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id ?? null,
    action: record.action,
    summary: record.summary,
    createdAt: record.created_at,
});

export const buildFolderPayload = (organizationId: string, input: CreateFolderInput) => ({
    organization_id: organizationId,
    parent_folder_id: input.parentFolderId || null,
    name: input.name,
    slug: input.slug,
    description: input.description,
});

export const buildDocumentPayload = (organizationId: string, profileId: string | null, input: CreateDocumentInput) => ({
    organization_id: organizationId,
    folder_id: input.folderId || null,
    title: input.title,
    file_name: input.fileName,
    file_url: input.fileUrl,
    mime_type: input.mimeType,
    file_size: input.fileSize,
    status: "active",
    current_version: 1,
    client_id: input.clientId || null,
    project_id: input.projectId || null,
    employee_id: input.employeeId || null,
    invoice_id: input.invoiceId || null,
    purchase_order_id: input.purchaseOrderId || null,
    support_ticket_id: input.supportTicketId || null,
    sales_opportunity_id: input.salesOpportunityId || null,
    uploaded_by: profileId,
});

export const buildTagPayload = (organizationId: string, input: CreateTagInput) => ({
    organization_id: organizationId,
    name: input.name,
    color: input.color,
});

export const buildTagLinkPayload = (documentId: string, tagId: string) => ({
    document_id: documentId,
    tag_id: tagId,
});

export const buildVersionPayload = (organizationId: string, input: CreateVersionInput) => ({
    organization_id: organizationId,
    document_id: input.documentId,
    version_number: input.versionNumber,
    file_url: input.fileUrl,
    file_size: input.fileSize,
    change_summary: input.changeSummary,
});

export const buildApprovalPayload = (organizationId: string, input: CreateApprovalInput) => ({
    organization_id: organizationId,
    document_id: input.documentId,
    approver_id: input.approverId || null,
    status: "pending",
    comments: input.comments,
});

export const buildEsignPayload = (organizationId: string, input: CreateEsignInput) => ({
    organization_id: organizationId,
    document_id: input.documentId,
    signer_name: input.signerName,
    signer_email: input.signerEmail,
    status: "draft",
});

export const buildSharePayload = (organizationId: string, input: CreateShareInput) => ({
    organization_id: organizationId,
    document_id: input.documentId,
    share_token: input.shareToken,
    recipient_email: input.recipientEmail,
    permission_level: input.permissionLevel,
    expires_at: input.expiresAt || null,
    is_active: true,
});

export const buildAccessGrantPayload = (organizationId: string, input: CreateAccessGrantInput) => ({
    organization_id: organizationId,
    document_id: input.documentId || null,
    folder_id: input.folderId || null,
    grantee_type: input.granteeType,
    grantee_id: input.granteeId || null,
    permission_level: input.permissionLevel,
});

export const buildTemplatePayload = (organizationId: string, input: CreateTemplateInput) => ({
    organization_id: organizationId,
    name: input.name,
    category: input.category,
    description: input.description,
    template_content: input.templateContent,
    status: "active",
});

export const buildRetentionPolicyPayload = (organizationId: string, input: CreateRetentionPolicyInput) => ({
    organization_id: organizationId,
    name: input.name,
    retention_days: input.retentionDays,
    action_on_expiry: input.actionOnExpiry,
    applies_to_category: input.appliesToCategory,
    is_active: true,
});

export const buildDocumentAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
});

export const buildDocumentsDashboardStats = (input: {
    documents: DocumentSummary[];
    folders: FolderSummary[];
    tags: TagSummary[];
    approvals: ApprovalSummary[];
    shares: ShareSummary[];
    archives: ArchiveSummary[];
    templates: TemplateSummary[];
}): DocumentsDashboardStats => {
    const pendingApprovals = input.approvals.filter((item) => item.status === "pending").length;
    const activeShares = input.shares.filter((item) => item.isActive).length;
    const totalSize = input.documents.reduce((sum, doc) => sum + doc.fileSize, 0);
    return {
        totalDocuments: input.documents.length,
        totalFolders: input.folders.length,
        totalTags: input.tags.length,
        pendingApprovals,
        activeShares,
        archivedDocuments: input.archives.length,
        activeTemplates: input.templates.filter((item) => item.status === "active").length,
        totalStorageBytes: totalSize,
    };
};

export const buildDocumentReport = (input: {
    documents: DocumentSummary[];
    folders: FolderSummary[];
    approvals: ApprovalSummary[];
    activityLogs: ActivityLogSummary[];
}): DocumentReport => {
    const statusMap = new Map<string, number>();
    for (const doc of input.documents) {
        statusMap.set(doc.status, (statusMap.get(doc.status) ?? 0) + 1);
    }
    const folderMap = new Map<string, number>();
    for (const doc of input.documents) {
        const folder = doc.folderName ?? "Unfiled";
        folderMap.set(folder, (folderMap.get(folder) ?? 0) + 1);
    }
    const approvalMap = new Map<string, number>();
    for (const approval of input.approvals) {
        approvalMap.set(approval.status, (approvalMap.get(approval.status) ?? 0) + 1);
    }
    const activityMap = new Map<string, number>();
    for (const log of input.activityLogs) {
        activityMap.set(log.activityType, (activityMap.get(log.activityType) ?? 0) + 1);
    }
    return {
        documentsByStatus: Array.from(statusMap.entries()).map(([label, count]) => ({ label, count })),
        documentsByFolder: Array.from(folderMap.entries()).map(([label, count]) => ({ label, count })),
        approvalsByStatus: Array.from(approvalMap.entries()).map(([label, count]) => ({ label, count })),
        activityByType: Array.from(activityMap.entries()).map(([label, count]) => ({ label, count })),
        totalDocuments: input.documents.length,
        totalFolders: input.folders.length,
    };
};

export const buildCrossModuleLinks = (input: { documents: DocumentSummary[] }): CrossModuleLinks => ({
    crmClients: new Set(input.documents.filter((doc) => doc.clientName).map((doc) => doc.clientName)).size,
    projectDocuments: input.documents.filter((doc) => doc.projectName).length,
    hrDocuments: input.documents.filter((doc) => doc.employeeName).length,
    financeInvoices: input.documents.filter((doc) => doc.invoiceNumber).length,
    inventoryPurchaseOrders: input.documents.filter((doc) => doc.purchaseOrderNumber).length,
    supportTickets: input.documents.filter((doc) => doc.supportTicketNumber).length,
    salesOpportunities: input.documents.filter((doc) => doc.salesOpportunityName).length,
    automationWorkflows: 0,
    analyticsMetrics: input.documents.length,
    settingsConfigured: true,
});

export const getTagNamesForDocument = (documentId: string, tagLinks: DbDocumentTagLink[], maps: LookupMaps): string[] =>
    tagLinks
        .filter((link) => link.document_id === documentId)
        .map((link) => maps.tags.get(link.tag_id)?.name)
        .filter((name): name is string => Boolean(name));

export const buildUpdateApprovalPayload = (input: UpdateApprovalStatusInput) => ({
    status: input.status,
    comments: input.comments ?? "",
    decided_at: input.status === "pending" ? null : new Date().toISOString(),
});

export const buildUpdateArchivePayload = (input: UpdateArchiveRestoreInput) => ({
    restore_available: input.restoreAvailable,
});
