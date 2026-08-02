export const KNOWLEDGE_TABS = {
    overview: "overview",
    repository: "repository",
    search: "search",
    solutions: "solutions",
    adrs: "adrs",
    prompts: "prompts",
    projectMemory: "projectMemory",
    clientMemory: "clientMemory",
    components: "components",
    patterns: "patterns",
    documentation: "documentation",
    aiContext: "aiContext",
    versions: "versions",
    analytics: "analytics",
    permissions: "permissions",
    crossLinks: "crossLinks",
    audit: "audit",
    api: "api",
} as const;

export const ENTRY_CATEGORY_OPTIONS = [
    { value: "general", label: "General" },
    { value: "architecture", label: "Architecture" },
    { value: "operations", label: "Operations" },
    { value: "delivery", label: "Delivery" },
    { value: "compliance", label: "Compliance" },
] as const;

export const MODULE_SOURCE_OPTIONS = [
    { value: "crm", label: "CRM" },
    { value: "projects", label: "Projects" },
    { value: "finance", label: "Finance" },
    { value: "hr", label: "HR" },
    { value: "inventory", label: "Inventory" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
    { value: "documents", label: "Documents" },
    { value: "automation", label: "Automation" },
    { value: "analytics", label: "Analytics" },
    { value: "ai", label: "AI Orchestration" },
    { value: "general", label: "General" },
] as const;

export const COMPONENT_TYPE_OPTIONS = [
    { value: "ui", label: "UI Component" },
    { value: "service", label: "Service" },
    { value: "hook", label: "Hook" },
    { value: "utility", label: "Utility" },
] as const;

export const PATTERN_TYPE_OPTIONS = [
    { value: "architecture", label: "Architecture" },
    { value: "integration", label: "Integration" },
    { value: "data", label: "Data" },
    { value: "security", label: "Security" },
] as const;

export const KNOWLEDGE_PERMISSIONS = ["knowledge.view", "knowledge.manage", "knowledge.publish", "knowledge.admin"] as const;
