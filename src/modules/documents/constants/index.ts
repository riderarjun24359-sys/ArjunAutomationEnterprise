export const DOCUMENTS_TABS = {
    overview: "overview",
    library: "library",
    folders: "folders",
    tags: "tags",
    versions: "versions",
    approvals: "approvals",
    esign: "esign",
    sharing: "sharing",
    access: "access",
    templates: "templates",
    preview: "preview",
    search: "search",
    retention: "retention",
    archive: "archive",
    activity: "activity",
    reports: "reports",
    audit: "audit",
} as const;

export const DOCUMENT_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
    { value: "pending_approval", label: "Pending Approval" },
] as const;

export const PERMISSION_LEVEL_OPTIONS = [
    { value: "view", label: "View" },
    { value: "comment", label: "Comment" },
    { value: "edit", label: "Edit" },
    { value: "admin", label: "Admin" },
] as const;

export const TEMPLATE_CATEGORY_OPTIONS = [
    { value: "general", label: "General" },
    { value: "legal", label: "Legal" },
    { value: "finance", label: "Finance" },
    { value: "projects", label: "Projects" },
    { value: "hr", label: "HR" },
] as const;

export const RETENTION_ACTION_OPTIONS = [
    { value: "archive", label: "Archive" },
    { value: "delete", label: "Delete" },
    { value: "review", label: "Review" },
] as const;

export const DOCUMENTS_PERMISSIONS = ["documents.view", "documents.manage", "documents.approve", "documents.admin"] as const;
