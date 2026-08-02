export type DocumentsTab =
    | "overview"
    | "library"
    | "folders"
    | "tags"
    | "versions"
    | "approvals"
    | "esign"
    | "sharing"
    | "access"
    | "templates"
    | "preview"
    | "search"
    | "retention"
    | "archive"
    | "activity"
    | "reports"
    | "audit";

export interface DocumentsDashboardStats {
    totalDocuments: number;
    totalFolders: number;
    totalTags: number;
    pendingApprovals: number;
    activeShares: number;
    archivedDocuments: number;
    activeTemplates: number;
    totalStorageBytes: number;
}

export interface FolderSummary {
    id: string;
    name: string;
    slug: string;
    description: string;
    parentFolderName?: string | null;
    documentCount: number;
    childFolderCount: number;
}

export interface DocumentSummary {
    id: string;
    title: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
    status: string;
    currentVersion: number;
    folderName?: string | null;
    clientName?: string | null;
    projectName?: string | null;
    employeeName?: string | null;
    invoiceNumber?: string | null;
    purchaseOrderNumber?: string | null;
    supportTicketNumber?: string | null;
    salesOpportunityName?: string | null;
    tags: string[];
    createdAt: string;
}

export interface TagSummary {
    id: string;
    name: string;
    color: string;
    documentCount: number;
}

export interface VersionSummary {
    id: string;
    documentTitle: string;
    versionNumber: number;
    fileUrl: string;
    fileSize: number;
    changeSummary: string;
    createdAt: string;
}

export interface ApprovalSummary {
    id: string;
    documentTitle: string;
    approverName?: string | null;
    status: string;
    comments: string;
    decidedAt?: string | null;
    createdAt: string;
}

export interface EsignSummary {
    id: string;
    documentTitle: string;
    signerName: string;
    signerEmail: string;
    status: string;
    sentAt?: string | null;
    preparedAt: string;
}

export interface ShareSummary {
    id: string;
    documentTitle: string;
    shareToken: string;
    recipientEmail: string;
    permissionLevel: string;
    expiresAt?: string | null;
    isActive: boolean;
    createdAt: string;
}

export interface AccessGrantSummary {
    id: string;
    documentTitle?: string | null;
    folderName?: string | null;
    granteeType: string;
    granteeName?: string | null;
    permissionLevel: string;
    createdAt: string;
}

export interface TemplateSummary {
    id: string;
    name: string;
    category: string;
    description: string;
    status: string;
    contentPreview: string;
}

export interface PreviewSummary {
    id: string;
    documentTitle: string;
    previewType: string;
    previewUrl: string;
    pageCount: number;
    generatedAt: string;
}

export interface SearchIndexSummary {
    id: string;
    documentTitle: string;
    searchText: string;
    indexedAt: string;
}

export interface RetentionPolicySummary {
    id: string;
    name: string;
    retentionDays: number;
    actionOnExpiry: string;
    appliesToCategory: string;
    isActive: boolean;
}

export interface ArchiveSummary {
    id: string;
    documentTitle: string;
    archivedAt: string;
    restoreAvailable: boolean;
}

export interface ActivityLogSummary {
    id: string;
    documentTitle?: string | null;
    activityType: string;
    summary: string;
    createdAt: string;
}

export interface DocumentAuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    createdAt: string;
}

export interface DocumentReport {
    documentsByStatus: Array<{ label: string; count: number }>;
    documentsByFolder: Array<{ label: string; count: number }>;
    approvalsByStatus: Array<{ label: string; count: number }>;
    activityByType: Array<{ label: string; count: number }>;
    totalDocuments: number;
    totalFolders: number;
}

export interface CrossModuleLinks {
    crmClients: number;
    projectDocuments: number;
    hrDocuments: number;
    financeInvoices: number;
    inventoryPurchaseOrders: number;
    supportTickets: number;
    salesOpportunities: number;
    automationWorkflows: number;
    analyticsMetrics: number;
    settingsConfigured: boolean;
}

export interface CreateFolderInput {
    name: string;
    slug: string;
    description: string;
    parentFolderId?: string;
}

export interface CreateDocumentInput {
    title: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
    folderId?: string;
    clientId?: string;
    projectId?: string;
    employeeId?: string;
    invoiceId?: string;
    purchaseOrderId?: string;
    supportTicketId?: string;
    salesOpportunityId?: string;
}

export interface CreateTagInput {
    name: string;
    color: string;
    documentId?: string;
}

export interface CreateVersionInput {
    documentId: string;
    versionNumber: number;
    fileUrl: string;
    fileSize: number;
    changeSummary: string;
}

export interface CreateApprovalInput {
    documentId: string;
    approverId?: string;
    comments: string;
}

export interface CreateEsignInput {
    documentId: string;
    signerName: string;
    signerEmail: string;
}

export interface CreateShareInput {
    documentId: string;
    shareToken: string;
    recipientEmail: string;
    permissionLevel: string;
    expiresAt?: string;
}

export interface CreateAccessGrantInput {
    documentId?: string;
    folderId?: string;
    granteeType: string;
    granteeId?: string;
    permissionLevel: string;
}

export interface CreateTemplateInput {
    name: string;
    category: string;
    description: string;
    templateContent: string;
}

export interface CreateRetentionPolicyInput {
    name: string;
    retentionDays: number;
    actionOnExpiry: string;
    appliesToCategory: string;
}

export interface UpdateApprovalStatusInput {
    status: string;
    comments?: string;
}

export interface UpdateArchiveRestoreInput {
    restoreAvailable: boolean;
}

export interface UpdateEsignStatusInput {
    status: string;
}
