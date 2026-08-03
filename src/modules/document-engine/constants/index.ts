export const DDE_TABS = {
    overview: "overview",
    documentHubs: "documentHubs",
    documentTypes: "documentTypes",
    documentCategories: "documentCategories",
    documentTemplates: "documentTemplates",
    documentVersions: "documentVersions",
    templateHeaders: "templateHeaders",
    templateFooters: "templateFooters",
    templateSections: "templateSections",
    templateVariables: "templateVariables",
    pdfGenerations: "pdfGenerations",
    htmlGenerations: "htmlGenerations",
    exportJobs: "exportJobs",
    batchGenerations: "batchGenerations",
    electronicSignatures: "electronicSignatures",
    approvalSignatures: "approvalSignatures",
    signatureVerifications: "signatureVerifications",
    signatureAuditEntries: "signatureAuditEntries",
    versionHistories: "versionHistories",
    retentionPolicies: "retentionPolicies",
    archiveRecords: "archiveRecords",
    sharingPolicies: "sharingPolicies",
    emailDeliveries: "emailDeliveries",
    downloadDeliveries: "downloadDeliveries",
    webhookDeliveries: "webhookDeliveries",
    generationAnalytics: "generationAnalytics",
    deliveryAnalytics: "deliveryAnalytics",
    storageAnalytics: "storageAnalytics",
    documentMetrics: "documentMetrics",
    documentHealth: "documentHealth",
    pendingSignatures: "pendingSignatures",
    documentFailures: "documentFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const DDE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "submitted", label: "Submitted" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
] as const;

export const DDE_PERMISSIONS = ["dde.view", "dde.manage", "dde.approve", "dde.admin"] as const;


export const DDE_THEME = {
    primary: "fuchsia-600",
    primaryHover: "fuchsia-500",
    ring: "fuchsia-500/20",
    text: "text-fuchsia-600",
    textDark: "dark:text-fuchsia-400",
    bg: "bg-fuchsia-600",
    bgHover: "hover:bg-fuchsia-500",
} as const;
