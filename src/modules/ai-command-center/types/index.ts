import type { AccEngineKey } from "../constants";

export interface AccContext {
    authUserId: string;
    email: string;
    fullName?: string | null;
    organizationId?: string | null;
}

export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type AlertStatus = "open" | "acknowledged" | "resolved";
export type RecommendationStatus = "pending" | "accepted" | "dismissed" | "executed";
export type DecisionStatus = "proposed" | "approved" | "rejected" | "executed";
export type AutomationStatus = "idle" | "running" | "succeeded" | "failed";
export type AgentStatus = "idle" | "active" | "processing" | "degraded";

export interface AccAlert {
    id: string;
    severity: AlertSeverity;
    sourceModule: string;
    title: string;
    detail: string;
    status: AlertStatus;
    createdAt: string;
}

export interface AccRecommendation {
    id: string;
    engineKey: AccEngineKey;
    title: string;
    detail: string;
    confidence: number;
    priority: "low" | "medium" | "high" | "critical";
    status: RecommendationStatus;
    createdAt: string;
}

export interface AccDecision {
    id: string;
    decisionType: string;
    summary: string;
    rationale: string;
    confidence: number;
    status: DecisionStatus;
    createdAt: string;
}

export interface AccAutomation {
    id: string;
    automationKey: string;
    title: string;
    status: AutomationStatus;
    lastRunAt?: string | null;
    resultSummary: string;
}

export interface AccAgentStatus {
    key: string;
    label: string;
    status: AgentStatus;
    healthScore: number;
    lastActivity: string;
}

export interface RevenueSummary {
    mrr: number;
    openInvoices: number;
    renewalsDue: number;
    activeClients: number;
    pipelineLeads: number;
}

export interface DeliveryStatusSummary {
    activeEngagements: number;
    qualityPassRate: number;
    deliveryHealth: number;
    pendingAi: number;
}

export interface SupportSlaSummary {
    openTickets: number;
    slaCompliance: number;
    supportHealth: number;
    incidents: number;
}

export interface AiCommandCenterDashboard {
    systemHealth: number;
    clientHealth: number;
    revenue: RevenueSummary;
    supportSla: SupportSlaSummary;
    deliveryStatus: DeliveryStatusSummary;
    agents: AccAgentStatus[];
    alerts: AccAlert[];
    recommendations: AccRecommendation[];
    decisions: AccDecision[];
    automations: AccAutomation[];
    overallScore: number;
    fetchedAt: string;
}
