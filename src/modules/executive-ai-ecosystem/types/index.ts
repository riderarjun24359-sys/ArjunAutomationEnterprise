import type { ExecutiveAgentKey } from "../constants";

export interface ExecutiveAiContext {
    authUserId: string;
    email: string;
    fullName?: string | null;
    organizationId?: string | null;
}

export type AgentStatus = "idle" | "active" | "processing" | "awaiting_approval";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type RecommendationStatus = "pending" | "approved" | "dismissed" | "executed";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ExecutiveAgentSnapshot {
    key: ExecutiveAgentKey;
    label: string;
    role: string;
    status: AgentStatus;
    activeTasks: number;
    pendingRecommendations: number;
    lastActivity: string;
    confidence: number;
}

export interface AgentTask {
    id: string;
    agentKey: ExecutiveAgentKey;
    taskType: string;
    title: string;
    detail: string;
    status: TaskStatus;
    priority: "low" | "medium" | "high" | "critical";
    createdAt: string;
}

export interface AgentRecommendation {
    id: string;
    agentKey: ExecutiveAgentKey;
    title: string;
    detail: string;
    confidence: number;
    requiresApproval: boolean;
    status: RecommendationStatus;
    sourceModules: string;
    createdAt: string;
}

export interface CollaborationEvent {
    id: string;
    eventType: "task_routed" | "conflict_resolved" | "recommendation_merged" | "approval_requested" | "approval_granted";
    agentKeys: string;
    summary: string;
    createdAt: string;
}

export interface ApprovalRequest {
    id: string;
    agentKey: ExecutiveAgentKey;
    actionSummary: string;
    status: ApprovalStatus;
    recommendationId?: string | null;
    createdAt: string;
}

export interface SharedKnowledgeSnapshot {
    organizationName: string;
    businessPlatform: { leads: number; clients: number; pendingAi: number };
    executiveIntelligence: { unifiedScore: number; risks: number; opportunities: number };
    deliveryEngine: { activeEngagements: number; qualityPassRate: number };
    productionReadiness: { overallScore: number; alerts: number };
    knowledgeEntries: number;
    fetchedAt: string;
}

export interface OrchestratorResult {
    unifiedResponse: string;
    routedAgents: ExecutiveAgentKey[];
    mergedRecommendations: AgentRecommendation[];
    conflictsResolved: number;
    requiresApproval: boolean;
}

export interface ExecutiveAiEcosystemDashboard {
    agents: ExecutiveAgentSnapshot[];
    recommendations: AgentRecommendation[];
    activeTasks: AgentTask[];
    alerts: Array<{ id: string; agentKey: ExecutiveAgentKey; title: string; severity: string }>;
    collaborationHistory: CollaborationEvent[];
    pendingApprovals: ApprovalRequest[];
    orchestratorStatus: "ready" | "processing" | "awaiting_approval";
    sharedKnowledge: SharedKnowledgeSnapshot;
}
