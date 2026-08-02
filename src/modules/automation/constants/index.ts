export const AUTOMATION_TABS = {
    overview: "overview",
    builder: "builder",
    agents: "agents",
    templates: "templates",
    executions: "executions",
    logs: "logs",
    monitoring: "monitoring",
    analytics: "analytics",
} as const;

export const WORKFLOW_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
] as const;

export const AGENT_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "draft", label: "Draft" },
] as const;

export const TRIGGER_TYPE_OPTIONS = [
    { value: "event", label: "Event" },
    { value: "schedule", label: "Schedule" },
    { value: "webhook", label: "Webhook" },
    { value: "manual", label: "Manual" },
] as const;

export const ACTION_TYPE_OPTIONS = [
    { value: "notify", label: "Notify" },
    { value: "email", label: "Email" },
    { value: "webhook", label: "Webhook" },
    { value: "ai_task", label: "AI Task" },
    { value: "create_task", label: "Create Task" },
    { value: "update_record", label: "Update Record" },
    { value: "delay", label: "Delay" },
] as const;

export const CONDITION_OPERATOR_OPTIONS = [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" },
    { value: "contains", label: "Contains" },
] as const;

export const AGENT_MODEL_OPTIONS = [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "claude-sonnet", label: "Claude Sonnet" },
] as const;

export const TEMPLATE_CATEGORY_OPTIONS = [
    { value: "onboarding", label: "Onboarding" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
    { value: "general", label: "General" },
] as const;

export const WORKFLOW_STATUS_FILTERS = {
    all: "all",
    draft: "draft",
    active: "active",
    paused: "paused",
    archived: "archived",
} as const;

export const LOG_LEVEL_OPTIONS = [
    { value: "info", label: "Info" },
    { value: "warn", label: "Warning" },
    { value: "error", label: "Error" },
    { value: "debug", label: "Debug" },
] as const;
