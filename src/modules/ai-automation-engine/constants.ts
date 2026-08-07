export const AAE_THEME = {
    title: "AI Automation & Workflow Engine",
    subtitle:
        "Enterprise automation that connects every module: workflow builder, triggers, actions, AI generation, execution, approvals, monitoring, templates, integrations, and executive ROI — live multi-tenant Founder/Admin operations.",
} as const;

export const AAE_TABS = {
    builder: "builder",
    triggers: "triggers",
    actions: "actions",
    generator: "generator",
    execution: "execution",
    approvals: "approvals",
    monitoring: "monitoring",
    templates: "templates",
    integrations: "integrations",
    executive: "executive",
} as const;

export type AaeTab = (typeof AAE_TABS)[keyof typeof AAE_TABS];

export const AAE_TAB_LIST: Array<{ id: AaeTab; label: string }> = [
    { id: AAE_TABS.builder, label: "Workflow Builder" },
    { id: AAE_TABS.triggers, label: "Trigger Center" },
    { id: AAE_TABS.actions, label: "Actions Library" },
    { id: AAE_TABS.generator, label: "AI Workflow Generator" },
    { id: AAE_TABS.execution, label: "Execution Center" },
    { id: AAE_TABS.approvals, label: "Approval Center" },
    { id: AAE_TABS.monitoring, label: "Monitoring Dashboard" },
    { id: AAE_TABS.templates, label: "Template Marketplace" },
    { id: AAE_TABS.integrations, label: "Integration Hub" },
    { id: AAE_TABS.executive, label: "Executive Dashboard" },
];

export const AAE_NODE_KINDS = ["condition", "branch", "delay", "loop", "action", "trigger", "template"] as const;
export type AaeNodeKind = (typeof AAE_NODE_KINDS)[number];

export const AAE_TRIGGER_TYPES = [
    "form_submitted",
    "lead_created",
    "deal_won",
    "invoice_overdue",
    "customer_created",
    "schedule",
    "manual",
    "webhook",
] as const;
export type AaeTriggerType = (typeof AAE_TRIGGER_TYPES)[number];

export const AAE_ACTION_TYPES = [
    "create_crm_record",
    "send_email",
    "send_whatsapp",
    "create_task",
    "update_deal",
    "publish_content",
    "generate_report",
    "ai_content_generation",
    "ai_image_generation",
    "ai_video_generation",
    "custom_http_request",
] as const;
export type AaeActionType = (typeof AAE_ACTION_TYPES)[number];

export const AAE_TEMPLATE_CATEGORIES = [
    "marketing",
    "sales",
    "customer_success",
    "finance",
    "hr",
    "operations",
] as const;
export type AaeTemplateCategory = (typeof AAE_TEMPLATE_CATEGORIES)[number];

export const AAE_INTEGRATION_TYPES = [
    "email",
    "calendar",
    "slack",
    "discord",
    "github",
    "stripe",
    "razorpay",
    "google_drive",
    "webhooks",
] as const;
export type AaeIntegrationType = (typeof AAE_INTEGRATION_TYPES)[number];

export const AAE_EXECUTION_STATUSES = ["running", "completed", "failed", "retry"] as const;
export type AaeExecutionStatus = (typeof AAE_EXECUTION_STATUSES)[number];
