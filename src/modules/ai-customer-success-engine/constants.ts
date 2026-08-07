export const ACSE_THEME = {
    title: "AI Customer Success & Support Engine",
    subtitle:
        "Enterprise AI support and customer success: inbox, tickets, health, renewals, knowledge, replies, SLA, automation, and executive intelligence — live multi-tenant Founder/Admin operations.",
} as const;

export const ACSE_TABS = {
    inbox: "inbox",
    tickets: "tickets",
    health: "health",
    renewals: "renewals",
    knowledge: "knowledge",
    replies: "replies",
    sla: "sla",
    success: "success",
    automation: "automation",
    executive: "executive",
} as const;

export type AcseTab = (typeof ACSE_TABS)[keyof typeof ACSE_TABS];

export const ACSE_TAB_LIST: Array<{ id: AcseTab; label: string }> = [
    { id: ACSE_TABS.inbox, label: "AI Support Inbox" },
    { id: ACSE_TABS.tickets, label: "Ticket Management" },
    { id: ACSE_TABS.health, label: "Customer Health" },
    { id: ACSE_TABS.renewals, label: "Renewal Center" },
    { id: ACSE_TABS.knowledge, label: "AI Knowledge Base" },
    { id: ACSE_TABS.replies, label: "AI Reply Generator" },
    { id: ACSE_TABS.sla, label: "SLA Dashboard" },
    { id: ACSE_TABS.success, label: "Customer Success Dashboard" },
    { id: ACSE_TABS.automation, label: "Automation Center" },
    { id: ACSE_TABS.executive, label: "Executive Intelligence" },
];

export const ACSE_INBOX_CHANNELS = ["email", "whatsapp", "live_chat", "contact_form"] as const;
export type AcseInboxChannel = (typeof ACSE_INBOX_CHANNELS)[number];

export const ACSE_TICKET_STATUSES = [
    "open",
    "pending",
    "waiting_customer",
    "escalated",
    "resolved",
    "closed",
] as const;
export type AcseTicketStatus = (typeof ACSE_TICKET_STATUSES)[number];

export const ACSE_REPLY_TONES = ["friendly", "professional", "technical"] as const;
export type AcseReplyTone = (typeof ACSE_REPLY_TONES)[number];

export const ACSE_REPLY_CHANNELS = ["email", "whatsapp", "ticket"] as const;
export type AcseReplyChannel = (typeof ACSE_REPLY_CHANNELS)[number];
