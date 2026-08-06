import type { CsgModuleKey } from "../constants";

export interface CsgContext {
    authUserId: string;
    email: string;
    fullName?: string | null;
    organizationId?: string | null;
}

export interface SuccessPlan {
    id: string;
    clientId?: string | null;
    title: string;
    goals: Array<{ title: string; metric: string; target: string }>;
    status: "draft" | "active" | "completed" | "archived";
    healthScore: number;
    ownerName: string;
}

export interface HealthScoreEntry {
    clientId: string;
    clientName: string;
    score: number;
    trend: "up" | "down" | "stable";
    riskLevel: "low" | "medium" | "high";
}

export interface RenewalRecord {
    id: string;
    clientName: string;
    renewalDate: string;
    amount: number;
    probability: number;
    status: string;
}

export interface EscalationRecord {
    id: string;
    clientName: string;
    reason: string;
    severity: string;
    status: string;
}

export interface SupportTicketSummary {
    id: string;
    subject: string;
    status: string;
    priority: string;
    slaStatus: string;
    clientName: string;
}

export interface OnboardingSession {
    id: string;
    clientName: string;
    status: string;
    checklistComplete: number;
    checklistTotal: number;
    kickoffAt?: string | null;
}

export interface DeliveryMilestone {
    id: string;
    title: string;
    stage: string;
    status: string;
    riskLevel: string;
    requiresClientApproval: boolean;
    dueAt?: string | null;
}

export interface FeedbackEntry {
    id: string;
    type: "csat" | "nps" | "feature_request" | "improvement" | "complaint";
    score?: number | null;
    comment: string;
    status: string;
    createdAt: string;
}

export interface ImprovementItem {
    id: string;
    sourceModule: string;
    title: string;
    detail: string;
    priority: string;
    status: string;
}

export interface AiOpsRecommendation {
    id: string;
    module: CsgModuleKey;
    title: string;
    detail: string;
    confidence: number;
}

export interface GlobalOperationsDashboard {
    activeClients: number;
    activeProjects: number;
    openTickets: number;
    slaCompliance: number;
    deliveryHealth: number;
    customerHealth: number;
    revenueOverview: { mrr: number; openInvoices: number; renewalsDue: number };
    supportHealth: number;
    aiRecommendations: AiOpsRecommendation[];
    successPlans: SuccessPlan[];
    healthScores: HealthScoreEntry[];
    renewals: RenewalRecord[];
    escalations: EscalationRecord[];
    tickets: SupportTicketSummary[];
    queueDepth: number;
    knowledgeArticles: number;
    incidents: number;
    onboardingSessions: OnboardingSession[];
    deliveryMilestones: DeliveryMilestone[];
    feedback: FeedbackEntry[];
    csatAverage: number;
    npsScore: number;
    improvementBacklog: ImprovementItem[];
    satisfactionTrend: Array<{ period: string; csat: number; nps: number }>;
}
