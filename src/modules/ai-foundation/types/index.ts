export type MemoryType =
    | "persistent"
    | "conversation"
    | "project"
    | "customer"
    | "business"
    | "workflow";

export interface MemoryRecord {
    id: string;
    type: MemoryType;
    key: string;
    content: string;
    scope: string;
    createdAt: string;
    updatedAt: string;
    ttlDays?: number | null;
}

export type KnowledgeNodeType =
    | "customer"
    | "project"
    | "capability"
    | "document"
    | "aiAgent"
    | "workflow"
    | "businessAsset"
    | "missionCore";

export interface KnowledgeNode {
    id: string;
    type: KnowledgeNodeType;
    label: string;
    metadata?: Record<string, unknown> | null;
}

export interface KnowledgeEdge {
    id: string;
    sourceId: string;
    targetId: string;
    relationship: string;
    weight: number;
}

export type PromptStatus = "draft" | "testing" | "approved" | "deprecated";

export interface PromptTemplate {
    id: string;
    name: string;
    version: string;
    content: string;
    status: PromptStatus;
    usageCount: number;
    approvedBy?: string | null;
    approvedAt?: string | null;
    createdAt: string;
}

export type AgentStatus = "active" | "inactive" | "degraded" | "maintenance";

export interface AiAgent {
    id: string;
    name: string;
    capabilities: string[];
    permissions: string[];
    health: "healthy" | "degraded" | "offline";
    version: string;
    owner: string;
    status: AgentStatus;
}

export type WorkflowExecutionMode = "sequential" | "parallel" | "conditional";

export interface AiWorkflowStep {
    id: string;
    agentId: string;
    action: string;
    requiresApproval: boolean;
    condition?: string | null;
}

export interface AiWorkflow {
    id: string;
    name: string;
    mode: WorkflowExecutionMode;
    steps: AiWorkflowStep[];
    status: "idle" | "running" | "completed" | "failed";
    orchestratedBy: "missionCore";
}

export interface EvaluationMetric {
    id: string;
    name: string;
    category: "accuracy" | "quality" | "consistency" | "latency" | "failures" | "hallucination";
    value: number;
    unit: string;
    threshold: number;
    status: "pass" | "warning" | "fail";
    measuredAt: string;
}

export type GovernancePolicyType = "model" | "pii" | "prompt_safety" | "output_validation" | "risk";

export interface GovernancePolicy {
    id: string;
    type: GovernancePolicyType;
    name: string;
    enforced: boolean;
    riskScore: number;
    approvedModels: string[];
    lastReviewedAt: string;
}

export interface CostUsageRecord {
    id: string;
    model: string;
    tokens: number;
    requests: number;
    costUsd: number;
    department: string;
    customer?: string | null;
    recordedAt: string;
}

export interface LearningFeedback {
    id: string;
    source: string;
    feedback: string;
    rating: number;
    status: "pending" | "reviewed" | "applied";
    createdAt: string;
}

export interface ExecutiveDashboardStats {
    aiHealthScore: number;
    activeAgents: number;
    modelHealth: "healthy" | "degraded" | "critical";
    totalTokens: number;
    totalCostUsd: number;
    qualityScore: number;
    riskScore: number;
    lastUpdatedAt: string;
}

export interface AiFoundationState {
    memories: MemoryRecord[];
    knowledgeNodes: KnowledgeNode[];
    knowledgeEdges: KnowledgeEdge[];
    prompts: PromptTemplate[];
    agents: AiAgent[];
    workflows: AiWorkflow[];
    evaluations: EvaluationMetric[];
    policies: GovernancePolicy[];
    costUsage: CostUsageRecord[];
    feedback: LearningFeedback[];
    dashboard: ExecutiveDashboardStats;
}
