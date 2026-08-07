import type { AcseInboxChannel, AcseReplyChannel, AcseReplyTone, AcseTicketStatus } from "./constants";

export interface SupportInboxRow {
    id: string;
    ticketNumber: string;
    subject: string;
    channel: AcseInboxChannel;
    priority: string;
    priorityLevel: number;
    status: string;
    queue: string;
    createdAt: string;
    dueAt: string;
}

export interface AiSupportInbox {
    rows: SupportInboxRow[];
    byChannel: Array<{ channel: string; count: number }>;
    byPriority: Array<{ priority: string; count: number }>;
    openCount: number;
}

export interface TicketBucket {
    status: AcseTicketStatus;
    count: number;
    tickets: SupportInboxRow[];
}

export interface TicketManagement {
    buckets: TicketBucket[];
    total: number;
    escalatedCount: number;
    resolvedCount: number;
}

export interface CustomerHealthRow {
    id: string;
    name: string;
    healthScore: number;
    usagePercent: number;
    loginSignal: string;
    churnRisk: number;
    expansionValue: number;
    status: string;
}

export interface CustomerHealthBoard {
    rows: CustomerHealthRow[];
    avgHealth: number | null;
    highChurnCount: number;
    expansionCount: number;
}

export interface RenewalRow {
    id: string;
    name: string;
    renewalDate: string;
    valueUsd: number;
    status: string;
    bucket: "upcoming" | "expired" | "payment_followup" | "reminder";
}

export interface RenewalCenter {
    rows: RenewalRow[];
    upcoming: number;
    expired: number;
    paymentFollowUp: number;
    reminderQueue: number;
    totalValue: number;
}

export interface KnowledgeRow {
    id: string;
    title: string;
    kind: "article" | "sop" | "faq" | "other";
    category: string;
    status: string;
    views: number;
}

export interface AiKnowledgeBase {
    articles: KnowledgeRow[];
    sops: KnowledgeRow[];
    faqs: KnowledgeRow[];
    searchIndexSize: number;
}

export interface ReplyTemplateRow {
    id: string;
    title: string;
    channel: AcseReplyChannel;
    tone: AcseReplyTone;
    shortcut: string;
    preview: string;
}

export interface AiReplyGenerator {
    templates: ReplyTemplateRow[];
    byTone: Array<{ tone: string; count: number }>;
    byChannel: Array<{ channel: string; count: number }>;
}

export interface SlaMetricRow {
    id: string;
    name: string;
    firstResponseMinutes: number;
    resolutionMinutes: number;
    compliancePercent: number;
    status: string;
}

export interface SlaDashboard {
    policies: SlaMetricRow[];
    avgFirstResponseMinutes: number | null;
    avgResolutionMinutes: number | null;
    breachCount: number;
    escalationCount: number;
    teamQueues: Array<{ queue: string; ticketCount: number }>;
}

export interface SuccessKpis {
    csat: number | null;
    nps: number | null;
    activeCustomers: number;
    churnRate: number | null;
    retentionRate: number | null;
    expansionRevenue: number;
}

export interface CustomerSuccessDashboard {
    kpis: SuccessKpis;
    ratingCount: number;
    kpiBoards: number;
}

export interface AutomationRuleRow {
    id: string;
    name: string;
    kind: "routing" | "assignment" | "followup" | "escalation" | "auto_close";
    trigger: string;
    level: number;
    active: boolean;
}

export interface AutomationCenter {
    rules: AutomationRuleRow[];
    activeRules: number;
    byKind: Array<{ kind: string; count: number }>;
}

export interface ExecutiveInsightRow {
    id: string;
    title: string;
    category: "health" | "revenue_risk" | "churn_risk" | "top_issue" | "team_kpi";
    detail: string;
    severity: "high" | "medium" | "low";
}

export interface ExecutiveIntelligence {
    insights: ExecutiveInsightRow[];
    summaries: Array<{ id: string; title: string; content: string }>;
    highSeverity: number;
}

export interface AiCustomerSuccessEngineSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    inbox: AiSupportInbox;
    tickets: TicketManagement;
    health: CustomerHealthBoard;
    renewals: RenewalCenter;
    knowledge: AiKnowledgeBase;
    replies: AiReplyGenerator;
    sla: SlaDashboard;
    success: CustomerSuccessDashboard;
    automation: AutomationCenter;
    executive: ExecutiveIntelligence;
}

export interface AiCustomerSuccessEngineRawData {
    organizationId: string;
    membershipRole: string | null;
    tickets: Array<{
        id: string;
        ticket_number: string;
        subject: string;
        description: string;
        status: string;
        priority_id: string | null;
        queue_id: string | null;
        due_at: string | null;
        resolved_at: string | null;
        created_at: string;
    }>;
    priorities: Array<{ id: string; name: string; level: number; response_hours: number }>;
    queues: Array<{ id: string; name: string; code: string; is_active: boolean }>;
    slas: Array<{
        id: string;
        name: string;
        first_response_minutes: number;
        resolution_minutes: number;
        is_active: boolean;
    }>;
    knowledgeArticles: Array<{
        id: string;
        title: string;
        content: string;
        status: string;
        view_count: number;
    }>;
    cannedResponses: Array<{ id: string; title: string; shortcut: string; body: string }>;
    escalationRules: Array<{
        id: string;
        name: string;
        trigger_condition: string;
        escalation_level: number;
        is_active: boolean;
    }>;
    satisfaction: Array<{ id: string; rating: number; comment: string; submitted_at: string }>;
    healthScores: Array<{
        id: string;
        name: string;
        overall_score: number;
        status: string;
    }>;
    adoption: Array<{
        id: string;
        name: string;
        adoption_percent: number;
        status: string;
    }>;
    churnPredictions: Array<{
        id: string;
        name: string;
        churn_probability: number;
        status: string;
    }>;
    expansions: Array<{
        id: string;
        name: string;
        estimated_value_usd: number;
        status: string;
    }>;
    renewals: Array<{
        id: string;
        name: string;
        renewal_date: string | null;
        renewal_value_usd: number;
        status: string;
    }>;
    slaMonitoring: Array<{
        id: string;
        name: string;
        compliance_percent: number;
        status: string;
    }>;
    kpiDashboards: Array<{ id: string; name: string; refresh_cadence: string; status: string }>;
    executiveSummaries: Array<{ id: string; title: string; summary_content: string; status: string }>;
    faqs: Array<{
        id: string;
        faq_question: string;
        faq_category: string;
        faq_status: string;
        answer_ref: string;
        status: string;
    }>;
    knowledgeEntries: Array<{
        id: string;
        title: string;
        category: string;
        status: string;
        content: string;
    }>;
    playbooks: Array<{ id: string; name: string; playbook_type: string; status: string }>;
    riskAnalyses: Array<{ id: string; name: string; risk_level: string; status: string }>;
}
