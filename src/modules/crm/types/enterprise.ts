export type CrmEnterpriseTab =
    | "directory"
    | "leads"
    | "profile"
    | "ai"
    | "communications"
    | "analytics";

export type DirectoryClientStatus = "active" | "inactive" | "at_risk" | "lead" | "other";
export type LeadPipelineStage = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type CommunicationChannel = "email" | "call" | "whatsapp" | "comment" | "meeting" | "other";
export type AiInsightKind = "next_best_action" | "follow_up" | "churn_risk" | "upsell" | "health";

export interface DirectoryClient {
    id: string;
    name: string;
    status: DirectoryClientStatus;
    rawStatus: string;
    industry: string;
    owner: string;
    companyProfile: string;
    contactEmail: string;
    phone: string;
    website: string;
    address: string;
    revenue: number;
    revenueLabel: string;
    tags: string[];
    lifecycleStage: string;
    updatedAt: string;
    createdAt: string;
}

export interface DirectoryQuery {
    search: string;
    status: string;
    owner: string;
    tag: string;
    page: number;
    pageSize: number;
}

export interface DirectoryResult {
    items: DirectoryClient[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
    owners: string[];
    tags: string[];
    statuses: string[];
}

export interface PipelineLead {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    stage: LeadPipelineStage;
    score: number;
    source: string;
    owner: string;
    value: number;
    valueLabel: string;
    origin: "sales_lead" | "crm_lead";
    updatedAt: string;
}

export interface LeadKanbanColumn {
    stage: LeadPipelineStage;
    label: string;
    leads: PipelineLead[];
}

export interface ClientProfileBundle {
    client: DirectoryClient;
    timeline: Array<{ id: string; title: string; detail: string; time: string; kind: string }>;
    notes: Array<{ id: string; title: string; detail: string; time: string }>;
    files: Array<{ id: string; name: string; detail: string; updatedAt: string }>;
    contacts: Array<{ id: string; name: string; email: string; phone: string; title: string }>;
    meetings: Array<{ id: string; title: string; when: string; status: string; location: string }>;
    tasks: Array<{ id: string; title: string; status: string; priority: string; dueDate: string }>;
    projects: Array<{ id: string; name: string; status: string; progress: number }>;
    revenue: {
        collected: number;
        outstanding: number;
        invoiceCount: number;
        label: string;
        detail: string;
    };
}

export interface AiCrmInsight {
    id: string;
    kind: AiInsightKind;
    priority: "P1" | "P2" | "P3";
    title: string;
    detail: string;
    clientId?: string;
    clientName?: string;
    healthScore?: number;
    actionLabel?: string;
}

export interface CommunicationItem {
    id: string;
    channel: CommunicationChannel;
    title: string;
    detail: string;
    actor: string;
    occurredAt: string;
    relativeTime: string;
}

export interface CrmAnalyticsBundle {
    conversionFunnel: Array<{ stage: string; count: number }>;
    winLoss: { won: number; lost: number; winRate: number; wonAmount: number; lostAmount: number };
    revenue: { collected: number; outstanding: number; label: string };
    teamPerformance: Array<{ owner: string; clients: number; leads: number; revenue: number }>;
}

export interface CrmEnterpriseStats {
    totalClients: number;
    totalLeads: number;
    openOpportunities: number;
    collectedRevenue: number;
    collectedRevenueLabel: string;
    conversionRate: number;
    averageHealthScore: number;
}

export interface CrmEnterpriseSnapshot {
    organizationId: string | null;
    source: "supabase" | "fallback";
    fetchedAt: string;
    stats: CrmEnterpriseStats;
    directory: DirectoryClient[];
    leads: PipelineLead[];
    kanban: LeadKanbanColumn[];
    communications: CommunicationItem[];
    analytics: CrmAnalyticsBundle;
    insights: AiCrmInsight[];
}
