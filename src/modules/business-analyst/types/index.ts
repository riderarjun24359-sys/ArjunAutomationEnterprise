export type BusinessAnalystTab =
    | "overview"
    | "engagements"
    | "interviews"
    | "brds"
    | "frs"
    | "userStories"
    | "acceptanceCriteria"
    | "processMaps"
    | "gapAnalysis"
    | "prioritization"
    | "risks"
    | "stakeholders"
    | "scope"
    | "proposals"
    | "costEstimates"
    | "timelineEstimates"
    | "versions"
    | "approvals"
    | "audit"
    | "api";

export interface BaDashboardStats {
    totalEngagements: number;
    activeEngagements: number;
    completedInterviews: number;
    brdCount: number;
    frsCount: number;
    userStoryCount: number;
    acceptanceCriteriaCount: number;
    processMapCount: number;
    gapAnalysisCount: number;
    openRisks: number;
    stakeholderCount: number;
    scopeItemCount: number;
    proposalCount: number;
    pendingApprovals: number;
    versionCount: number;
}

export interface BaPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentWorker: string;
    nextWorker: string;
}

export interface EngagementSummary {
    id: string;
    title: string;
    engagementKey: string;
    clientName?: string | null;
    projectName?: string | null;
    agentName?: string | null;
    pipelineStage: string;
    status: string;
    summaryPreview: string;
    updatedAt: string;
}

export interface InterviewSummary {
    id: string;
    engagementTitle: string;
    interviewKey: string;
    stakeholderName: string;
    questionCount: number;
    status: string;
    conductedAt?: string | null;
}

export interface BrdSummary {
    id: string;
    engagementTitle: string;
    title: string;
    status: string;
    currentVersion: number;
    summaryPreview: string;
}

export interface FrsSummary {
    id: string;
    engagementTitle: string;
    title: string;
    status: string;
    requirementsPreview: string;
}

export interface UserStorySummary {
    id: string;
    engagementTitle: string;
    storyKey: string;
    title: string;
    persona: string;
    priority: string;
    status: string;
    descriptionPreview: string;
}

export interface AcceptanceCriterionSummary {
    id: string;
    userStoryTitle: string;
    criterionKey: string;
    description: string;
    status: string;
}

export interface ProcessMapSummary {
    id: string;
    engagementTitle: string;
    name: string;
    processType: string;
    stepCount: number;
    status: string;
}

export interface GapAnalysisSummary {
    id: string;
    engagementTitle: string;
    currentStatePreview: string;
    desiredStatePreview: string;
    gapCount: number;
    status: string;
}

export interface FeaturePrioritySummary {
    id: string;
    engagementTitle: string;
    featureName: string;
    priorityScore: number;
    priorityRank: number;
    status: string;
}

export interface RiskSummary {
    id: string;
    engagementTitle: string;
    riskKey: string;
    title: string;
    likelihood: string;
    impact: string;
    status: string;
}

export interface StakeholderSummary {
    id: string;
    engagementTitle: string;
    name: string;
    role: string;
    influence: string;
    interest: string;
    status: string;
}

export interface ScopeItemSummary {
    id: string;
    engagementTitle: string;
    itemKey: string;
    title: string;
    scopeType: string;
    status: string;
}

export interface ProposalSummary {
    id: string;
    engagementTitle: string;
    title: string;
    status: string;
    summaryPreview: string;
}

export interface CostEstimateSummary {
    id: string;
    engagementTitle: string;
    estimateKey: string;
    totalAmount: number;
    currency: string;
    status: string;
}

export interface TimelineEstimateSummary {
    id: string;
    engagementTitle: string;
    estimateKey: string;
    totalDurationDays: number;
    status: string;
}

export interface VersionSummary {
    id: string;
    engagementTitle: string;
    entityType: string;
    versionNumber: number;
    changeSummary: string;
    createdAt: string;
}

export interface ReviewApprovalSummary {
    id: string;
    engagementTitle: string;
    entityType: string;
    reviewerName?: string | null;
    approvalStatus: string;
    comments: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    createdAt: string;
}

export interface CreateEngagementInput { title: string; engagementKey: string; clientId?: string; projectId?: string; agentId?: string; sessionId?: string; knowledgeContextId?: string; pipelineStage?: string; summary?: string; }
export interface CreateInterviewInput { engagementId: string; interviewKey: string; stakeholderName: string; questions?: string[]; responses?: string[]; status?: string; }
export interface CreateBrdInput { engagementId: string; title: string; executiveSummary: string; businessObjectives?: string; scopeOverview?: string; content?: string; }
export interface CreateFrsInput { engagementId: string; brdId?: string; title: string; functionalRequirements: string; nonFunctionalRequirements?: string; content?: string; }
export interface CreateUserStoryInput { engagementId: string; frsId?: string; storyKey: string; title: string; description?: string; persona?: string; priority?: string; }
export interface CreateAcceptanceCriterionInput { userStoryId: string; criterionKey: string; description: string; testScenario?: string; }
export interface CreateProcessMapInput { engagementId: string; name: string; processType?: string; steps?: string[]; description?: string; }
export interface CreateGapAnalysisInput { engagementId: string; currentState: string; desiredState: string; gaps?: string[]; recommendations?: string; }
export interface CreateFeaturePriorityInput { engagementId: string; featureName: string; priorityScore: number; rationale?: string; }
export interface CreateRiskInput { engagementId: string; riskKey: string; title: string; description?: string; likelihood?: string; impact?: string; mitigation?: string; }
export interface CreateStakeholderInput { engagementId: string; name: string; role?: string; influence?: string; interest?: string; contactInfo?: string; }
export interface CreateScopeItemInput { engagementId: string; itemKey: string; title: string; scopeType?: string; description?: string; }
export interface CreateProposalInput { engagementId: string; title: string; executiveSummary: string; deliverables?: string; content?: string; }
export interface CreateCostEstimateInput { engagementId: string; estimateKey: string; lineItems?: Array<{ item: string; amount: number }>; totalAmount: number; currency?: string; assumptions?: string; }
export interface CreateTimelineEstimateInput { engagementId: string; estimateKey: string; phases?: Array<{ phase: string; days: number }>; totalDurationDays: number; assumptions?: string; }
export interface CreateVersionInput { engagementId: string; entityType: string; entityId: string; content: string; changeSummary: string; }
export interface CreateReviewApprovalInput { engagementId: string; entityType: string; entityId?: string; reviewerId?: string; approvalStatus?: string; comments?: string; }

export interface BaSdkStartEngagementInput {
    title: string;
    engagementKey: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
}

export interface BaSdkStartEngagementResult {
    engagementId: string;
    engagementKey: string;
    pipelineStage: string;
    aiTaskId?: string | null;
}

export interface BaSdkGenerateArtifactInput {
    engagementId: string;
    artifactType: "brd" | "frs" | "user_story" | "proposal";
    title: string;
    content: string;
}

export interface BaSdkGenerateArtifactResult {
    artifactId: string;
    artifactType: string;
    status: string;
}

export interface BaSdkRunAnalysisInput {
    engagementId: string;
    analysisType: "gap" | "risk" | "priority";
    inputPayload: Record<string, unknown>;
}

export interface BaSdkRunAnalysisResult {
    analysisId: string;
    analysisType: string;
    status: string;
}
