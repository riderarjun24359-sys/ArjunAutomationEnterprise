export const SUPPORT_TABS = {
    overview: "overview",
    tickets: "tickets",
    categories: "categories",
    priorities: "priorities",
    slas: "slas",
    queues: "queues",
    agents: "agents",
    portal: "portal",
    notes: "notes",
    attachments: "attachments",
    knowledgeBase: "knowledgeBase",
    cannedResponses: "cannedResponses",
    escalation: "escalation",
    satisfaction: "satisfaction",
    reports: "reports",
    audit: "audit",
} as const;

export const TICKET_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const ARTICLE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
] as const;

export const ESCALATION_TRIGGER_OPTIONS = [
    { value: "sla_breach", label: "SLA Breach" },
    { value: "priority_critical", label: "Critical Priority" },
    { value: "no_response", label: "No Response" },
    { value: "customer_request", label: "Customer Request" },
] as const;

export const SUPPORT_PERMISSIONS = ["support.view", "support.manage", "support.agents.manage", "support.knowledge.manage"] as const;
