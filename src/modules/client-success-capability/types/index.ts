import type { SupportedLanguage } from "@/src/modules/gci/types";
import { AI_DELIVERY_LEVELS } from "@/src/constants/ai-delivery-model";

export interface ClientSuccessAuditEntry {
    id: string;
    action: string;
    clientId: string;
    timestamp: string;
    details: Record<string, unknown>;
}

export interface Stakeholder {
    id: string;
    name: string;
    role: string;
    email: string;
    influence: "high" | "medium" | "low";
}

export interface SuccessGoal {
    id: string;
    title: string;
    metric: string;
    target: string;
    current: string;
    status: "on-track" | "at-risk" | "achieved";
}

export interface OnboardingProfile {
    clientId: string;
    requirements: string[];
    stakeholders: Stakeholder[];
    goals: SuccessGoal[];
    metrics: { name: string; value: number; unit: string }[];
    checklist: { id: string; label: string; completed: boolean; deliveryLevel?: number }[];
    aiAnalysis: string;
    deliveryLevels: ReadonlyArray<(typeof AI_DELIVERY_LEVELS)[number]>;
    completedAt?: string;
}

export interface ProjectWorkspace {
    clientId: string;
    projectId: string;
    projectName: string;
    milestones: { id: string; name: string; status: string; dueDate: string }[];
    tasks: { id: string; title: string; assignee: string; status: string }[];
    deliverables: { id: string; name: string; type: string; status: string }[];
    team: { id: string; name: string; role: string }[];
    documents: { id: string; title: string; path: string }[];
}

export interface ClientPortalData {
    clientId: string;
    locale: SupportedLanguage;
    dashboard: { progress: number; activeMilestones: number; openApprovals: number };
    files: { id: string; name: string; type: string; updatedAt: string }[];
    invoices: { id: string; number: string; amount: number; status: string }[];
    docs: { id: string; title: string; category: string }[];
    approvals: { id: string; title: string; status: string; dueDate: string }[];
    meetings: { id: string; title: string; date: string; summary?: string }[];
    support: { id: string; subject: string; status: string; priority: string }[];
    knowledgeBase: { id: string; title: string; category: string }[];
}

export interface CommunicationCenterData {
    clientId: string;
    emails: { id: string; subject: string; date: string; direction: "inbound" | "outbound"; summary: string }[];
    meetings: { id: string; title: string; date: string; aiSummary: string }[];
    aiSummaries: { id: string; topic: string; summary: string; generatedAt: string }[];
    reminders: { id: string; message: string; dueDate: string; sent: boolean }[];
}

export interface ApprovalItem {
    id: string;
    type: "requirements" | "design" | "document" | "deployment";
    title: string;
    status: "pending" | "approved" | "rejected" | "revision";
    requestedAt: string;
    decidedAt?: string;
    decidedBy?: string;
}

export interface ApprovalCenterData {
    clientId: string;
    pending: ApprovalItem[];
    history: ApprovalItem[];
}

export interface ChangeRequestInput {
    clientId: string;
    title: string;
    description: string;
    requestedBy: string;
    priority: "low" | "medium" | "high" | "critical";
}

export interface ChangeRequestResult {
    id: string;
    clientId: string;
    title: string;
    impactAnalysis: {
        business: string;
        cost: string;
        risk: string;
        timeline: string;
    };
    approvalWorkflow: { step: string; status: string }[];
    status: "submitted" | "under-review" | "approved" | "rejected";
}

export interface DeliveryCenterData {
    clientId: string;
    qaChecklist: { id: string; item: string; completed: boolean; deliveryLevel: number }[];
    deploymentChecklist: { id: string; item: string; completed: boolean }[];
    training: { id: string; module: string; completed: boolean }[];
    docs: { id: string; title: string; status: string }[];
    handover: { item: string; status: string; owner: string }[];
}

export interface CustomerHealthData {
    clientId: string;
    healthScore: number;
    csat: number;
    engagement: number;
    renewalProbability: number;
    riskAlerts: { id: string; severity: "low" | "medium" | "high"; message: string }[];
    trends: { metric: string; direction: "up" | "down" | "stable"; value: number }[];
}

export interface RenewalGrowthData {
    clientId: string;
    renewals: { id: string; contractEnd: string; value: number; probability: number }[];
    upsell: { id: string; opportunity: string; value: number; stage: string }[];
    crossSell: { id: string; product: string; fit: number; stage: string }[];
    referrals: { id: string; contact: string; status: string }[];
    testimonials: { id: string; quote: string; author: string; published: boolean }[];
}

export interface AiSuccessManagerInsights {
    clientId: string;
    nextActions: { id: string; action: string; priority: string; dueDate: string }[];
    projectRisks: { id: string; risk: string; severity: string; mitigation: string }[];
    customerRisks: { id: string; risk: string; severity: string; mitigation: string }[];
    improvements: { id: string; area: string; recommendation: string }[];
    automationOps: { id: string; workflow: string; status: string; savings: string }[];
}

export interface ClientSuccessState {
    selectedClientId: string | null;
    clientLocales: Record<string, SupportedLanguage>;
    onboarding: Record<string, OnboardingProfile>;
    workspaces: Record<string, ProjectWorkspace>;
    portalData: Record<string, ClientPortalData>;
    communication: Record<string, CommunicationCenterData>;
    approvals: Record<string, ApprovalCenterData>;
    changeRequests: ChangeRequestResult[];
    delivery: Record<string, DeliveryCenterData>;
    health: Record<string, CustomerHealthData>;
    renewal: Record<string, RenewalGrowthData>;
    insights: Record<string, AiSuccessManagerInsights>;
    auditLog: ClientSuccessAuditEntry[];
    updatedAt: string;
}

export interface ClientSuccessServiceContext {
    authUserId: string;
    email: string;
    fullName?: string | null;
}
