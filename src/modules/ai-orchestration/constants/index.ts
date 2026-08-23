export const AI_ORCHESTRATION_TABS = {
    overview: "overview",
    providers: "providers",
    routing: "routing",
    agents: "agents",
    prompts: "prompts",
    tasks: "tasks",
    sessions: "sessions",
    usage: "usage",
    costs: "costs",
    rateLimits: "rateLimits",
    permissions: "permissions",
    health: "health",
    retry: "retry",
    audit: "audit",
    analytics: "analytics",
    sdk: "sdk",
} as const;

export const PROVIDER_KEY_OPTIONS = [
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "azure", label: "Azure OpenAI" },
    { value: "google", label: "Google AI" },
    { value: "gemini", label: "Google Gemini" },
] as const;

export const AGENT_TYPE_OPTIONS = [
    { value: "general", label: "General" },
    { value: "analyst", label: "Business Analyst" },
    { value: "architect", label: "Architect" },
    { value: "qa", label: "QA" },
    { value: "support", label: "Support" },
    { value: "operations", label: "Operations" },
] as const;

export const ROUTING_STRATEGY_OPTIONS = [
    { value: "priority", label: "Priority" },
    { value: "fallback", label: "Fallback" },
    { value: "round_robin", label: "Round Robin" },
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
    { value: "settings", label: "Settings" },
] as const;

export const AI_PERMISSIONS = ["ai.view", "ai.manage", "ai.execute", "ai.admin"] as const;
