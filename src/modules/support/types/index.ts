export type SupportTab =
    | "overview"
    | "tickets"
    | "categories"
    | "priorities"
    | "slas"
    | "queues"
    | "agents"
    | "portal"
    | "notes"
    | "attachments"
    | "knowledgeBase"
    | "cannedResponses"
    | "escalation"
    | "satisfaction"
    | "reports"
    | "audit";

export interface SupportDashboardStats {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    avgSatisfaction: number;
    activeAgents: number;
    slaCompliance: number;
    knowledgeArticles: number;
    openEscalations: number;
}

export interface SupportCategorySummary {
    id: string;
    name: string;
    slug: string;
    description: string;
    ticketCount: number;
}

export interface SupportPrioritySummary {
    id: string;
    name: string;
    level: number;
    color: string;
    responseHours: number;
    ticketCount: number;
}

export interface SupportSlaSummary {
    id: string;
    name: string;
    priorityName?: string | null;
    firstResponseMinutes: number;
    resolutionMinutes: number;
    isActive: boolean;
}

export interface SupportQueueSummary {
    id: string;
    name: string;
    code: string;
    description: string;
    defaultAssigneeName?: string | null;
    isActive: boolean;
    ticketCount: number;
}

export interface SupportTicketSummary {
    id: string;
    ticketNumber: string;
    subject: string;
    description: string;
    status: string;
    categoryName?: string | null;
    priorityName?: string | null;
    queueName?: string | null;
    clientName?: string | null;
    projectName?: string | null;
    agentName?: string | null;
    portalVisible: boolean;
    dueAt?: string | null;
    resolvedAt?: string | null;
    createdAt: string;
}

export interface SupportNoteSummary {
    id: string;
    ticketNumber: string;
    body: string;
    isInternal: boolean;
    createdAt: string;
}

export interface SupportAttachmentSummary {
    id: string;
    ticketNumber: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    createdAt: string;
}

export interface KnowledgeArticleSummary {
    id: string;
    title: string;
    slug: string;
    categoryName?: string | null;
    status: string;
    viewCount: number;
}

export interface CannedResponseSummary {
    id: string;
    title: string;
    shortcut: string;
    body: string;
    categoryName?: string | null;
}

export interface EscalationRuleSummary {
    id: string;
    name: string;
    triggerCondition: string;
    escalationLevel: number;
    targetQueueName?: string | null;
    notifyAgentName?: string | null;
    isActive: boolean;
}

export interface SatisfactionRatingSummary {
    id: string;
    ticketNumber: string;
    rating: number;
    comment: string;
    submittedAt: string;
}

export interface PortalSettingsSummary {
    id: string;
    portalEnabled: boolean;
    welcomeMessage: string;
    allowTicketCreation: boolean;
    showKnowledgeBase: boolean;
    customDomain: string;
}

export interface AgentAssignmentSummary {
    agentId: string;
    agentName: string;
    assignedTickets: number;
    openTickets: number;
    resolvedTickets: number;
}

export interface SupportAuditEntry {
    id: string;
    entityType: string;
    action: string;
    summary: string;
    createdAt: string;
}

export interface SupportReport {
    ticketsByStatus: Array<{ status: string; count: number }>;
    ticketsByCategory: Array<{ category: string; count: number }>;
    ticketsByPriority: Array<{ priority: string; count: number }>;
    satisfactionDistribution: Array<{ rating: string; count: number }>;
    queueWorkload: Array<{ queue: string; count: number }>;
}

export interface CrossModuleLinks {
    crmClients: number;
    projectTickets: number;
    hrAgents: number;
    financeInvoices: number;
    automationTriggers: number;
    analyticsMetrics: number;
    settingsConfigured: boolean;
}

export interface CreateCategoryInput { name: string; slug: string; description: string; }
export interface CreatePriorityInput { name: string; level: number; color: string; responseHours: number; }
export interface CreateSlaInput { name: string; priorityId?: string; firstResponseMinutes: number; resolutionMinutes: number; }
export interface CreateQueueInput { name: string; code: string; description: string; defaultAssigneeId?: string; }
export interface CreateTicketInput { ticketNumber: string; subject: string; description: string; categoryId?: string; priorityId?: string; queueId?: string; clientId?: string; assignedAgentId?: string; }
export interface CreateNoteInput { ticketId: string; body: string; isInternal: boolean; }
export interface CreateAttachmentInput { ticketId: string; fileName: string; fileUrl: string; fileSize: number; mimeType: string; }
export interface CreateKnowledgeArticleInput { title: string; slug: string; content: string; categoryId?: string; }
export interface CreateCannedResponseInput { title: string; shortcut: string; body: string; }
export interface CreateEscalationRuleInput { name: string; triggerCondition: string; escalationLevel: number; targetQueueId?: string; }
export interface UpdatePortalSettingsInput { portalEnabled: boolean; welcomeMessage: string; allowTicketCreation: boolean; showKnowledgeBase: boolean; customDomain: string; }
export interface UpdateTicketStatusInput { status: string; }
