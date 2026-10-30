import type {
    DbAiOrchestrationAgent,
    DbAiSession,
    DbBaAcceptanceCriterion,
    DbBaAuditLog,
    DbBaBrd,
    DbBaCostEstimate,
    DbBaEngagement,
    DbBaFeaturePriority,
    DbBaFrsDocument,
    DbBaGapAnalysis,
    DbBaInterview,
    DbBaProcessMap,
    DbBaProposal,
    DbBaRequirementVersion,
    DbBaReviewApproval,
    DbBaRisk,
    DbBaScopeItem,
    DbBaStakeholder,
    DbBaTimelineEstimate,
    DbBaUserStory,
    DbClient,
    DbEmployee,
    DbProject,
} from "@/src/modules/database/types/platform";
import type {
    AcceptanceCriterionSummary,
    AuditEntry,
    BaDashboardStats,
    BaPipelineInfo,
    BrdSummary,
    CostEstimateSummary,
    CreateAcceptanceCriterionInput,
    CreateBrdInput,
    CreateCostEstimateInput,
    CreateEngagementInput,
    CreateFeaturePriorityInput,
    CreateFrsInput,
    CreateGapAnalysisInput,
    CreateInterviewInput,
    CreateProcessMapInput,
    CreateProposalInput,
    CreateReviewApprovalInput,
    CreateRiskInput,
    CreateScopeItemInput,
    CreateStakeholderInput,
    CreateTimelineEstimateInput,
    CreateUserStoryInput,
    CreateVersionInput,
    EngagementSummary,
    FeaturePrioritySummary,
    FrsSummary,
    GapAnalysisSummary,
    InterviewSummary,
    ProcessMapSummary,
    ProposalSummary,
    ReviewApprovalSummary,
    RiskSummary,
    ScopeItemSummary,
    StakeholderSummary,
    TimelineEstimateSummary,
    UserStorySummary,
    VersionSummary,
} from "@/src/modules/business-analyst/types";

type LookupMaps = {
    engagements: Map<string, DbBaEngagement>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
    employees: Map<string, DbEmployee>;
    userStories: Map<string, DbBaUserStory>;
};

export const buildLookupMaps = (
    engagements: DbBaEngagement[],
    clients: DbClient[],
    projects: DbProject[],
    agents: DbAiOrchestrationAgent[],
    sessions: DbAiSession[],
    employees: DbEmployee[],
    userStories: DbBaUserStory[] = [],
): LookupMaps => ({
    engagements: new Map(engagements.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    agents: new Map(agents.map((item) => [item.id, item])),
    sessions: new Map(sessions.map((item) => [item.id, item])),
    employees: new Map(employees.map((item) => [item.id, item])),
    userStories: new Map(userStories.map((item) => [item.id, item])),
});

const engagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.engagements.get(id)?.title ?? null : null);
const clientName = (maps: LookupMaps, id?: string | null) => (id ? maps.clients.get(id)?.name ?? null : null);
const projectName = (maps: LookupMaps, id?: string | null) => (id ? maps.projects.get(id)?.name ?? null : null);
const agentName = (maps: LookupMaps, id?: string | null) => (id ? maps.agents.get(id)?.name ?? null : null);
const employeeName = (maps: LookupMaps, id?: string | null) => {
    if (!id) return null;
    const employee = maps.employees.get(id);
    return employee ? `${employee.first_name} ${employee.last_name}` : null;
};

export const mapEngagementSummary = (record: DbBaEngagement, maps: LookupMaps): EngagementSummary => ({
    id: record.id, title: record.title, engagementKey: record.engagement_key, clientName: clientName(maps, record.client_id), projectName: projectName(maps, record.project_id), agentName: agentName(maps, record.agent_id), pipelineStage: record.pipeline_stage, status: record.status, summaryPreview: record.summary.slice(0, 100), updatedAt: record.updated_at,
});

export const mapInterviewSummary = (record: DbBaInterview, maps: LookupMaps): InterviewSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", interviewKey: record.interview_key, stakeholderName: record.stakeholder_name, questionCount: Array.isArray(record.questions) ? record.questions.length : 0, status: record.status, conductedAt: record.conducted_at ?? null,
});

export const mapBrdSummary = (record: DbBaBrd, maps: LookupMaps): BrdSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", title: record.title, status: record.status, currentVersion: record.current_version, summaryPreview: record.executive_summary.slice(0, 100),
});

export const mapFrsSummary = (record: DbBaFrsDocument, maps: LookupMaps): FrsSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", title: record.title, status: record.status, requirementsPreview: record.functional_requirements.slice(0, 100),
});

export const mapUserStorySummary = (record: DbBaUserStory, maps: LookupMaps): UserStorySummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", storyKey: record.story_key, title: record.title, persona: record.persona, priority: record.priority, status: record.status, descriptionPreview: record.description.slice(0, 80),
});

export const mapAcceptanceCriterionSummary = (record: DbBaAcceptanceCriterion, maps: LookupMaps): AcceptanceCriterionSummary => ({
    id: record.id, userStoryTitle: maps.userStories.get(record.user_story_id)?.title ?? "Unknown", criterionKey: record.criterion_key, description: record.description, status: record.status,
});

export const mapProcessMapSummary = (record: DbBaProcessMap, maps: LookupMaps): ProcessMapSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, processType: record.process_type, stepCount: Array.isArray(record.steps) ? record.steps.length : 0, status: record.status,
});

export const mapGapAnalysisSummary = (record: DbBaGapAnalysis, maps: LookupMaps): GapAnalysisSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", currentStatePreview: record.current_state.slice(0, 80), desiredStatePreview: record.desired_state.slice(0, 80), gapCount: Array.isArray(record.gaps) ? record.gaps.length : 0, status: record.status,
});

export const mapFeaturePrioritySummary = (record: DbBaFeaturePriority, maps: LookupMaps): FeaturePrioritySummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", featureName: record.feature_name, priorityScore: Number(record.priority_score), priorityRank: record.priority_rank, status: record.status,
});

export const mapRiskSummary = (record: DbBaRisk, maps: LookupMaps): RiskSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", riskKey: record.risk_key, title: record.title, likelihood: record.likelihood, impact: record.impact, status: record.status,
});

export const mapStakeholderSummary = (record: DbBaStakeholder, maps: LookupMaps): StakeholderSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", name: record.name, role: record.role, influence: record.influence, interest: record.interest, status: record.status,
});

export const mapScopeItemSummary = (record: DbBaScopeItem, maps: LookupMaps): ScopeItemSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", itemKey: record.item_key, title: record.title, scopeType: record.scope_type, status: record.status,
});

export const mapProposalSummary = (record: DbBaProposal, maps: LookupMaps): ProposalSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", title: record.title, status: record.status, summaryPreview: record.executive_summary.slice(0, 100),
});

export const mapCostEstimateSummary = (record: DbBaCostEstimate, maps: LookupMaps): CostEstimateSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", estimateKey: record.estimate_key, totalAmount: Number(record.total_amount), currency: record.currency, status: record.status,
});

export const mapTimelineEstimateSummary = (record: DbBaTimelineEstimate, maps: LookupMaps): TimelineEstimateSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", estimateKey: record.estimate_key, totalDurationDays: record.total_duration_days, status: record.status,
});

export const mapVersionSummary = (record: DbBaRequirementVersion, maps: LookupMaps): VersionSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", entityType: record.entity_type, versionNumber: record.version_number, changeSummary: record.change_summary, createdAt: record.created_at,
});

export const mapReviewApprovalSummary = (record: DbBaReviewApproval, maps: LookupMaps): ReviewApprovalSummary => ({
    id: record.id, engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown", entityType: record.entity_type, reviewerName: employeeName(maps, record.reviewer_id), approvalStatus: record.approval_status, comments: record.comments,
});

export const mapAuditEntry = (record: DbBaAuditLog): AuditEntry => ({
    id: record.id, entityType: record.entity_type, entityId: record.entity_id ?? null, action: record.action, summary: record.summary, createdAt: record.created_at,
});

export const buildBaDashboardStats = (input: {
    engagements: EngagementSummary[];
    interviews: InterviewSummary[];
    brds: BrdSummary[];
    frsDocuments: FrsSummary[];
    userStories: UserStorySummary[];
    acceptanceCriteria: AcceptanceCriterionSummary[];
    processMaps: ProcessMapSummary[];
    gapAnalyses: GapAnalysisSummary[];
    featurePriorities: FeaturePrioritySummary[];
    risks: RiskSummary[];
    stakeholders: StakeholderSummary[];
    scopeItems: ScopeItemSummary[];
    proposals: ProposalSummary[];
    costEstimates: CostEstimateSummary[];
    timelineEstimates: TimelineEstimateSummary[];
    versions: VersionSummary[];
    approvals: ReviewApprovalSummary[];
}): BaDashboardStats => ({
    totalEngagements: input.engagements.length,
    activeEngagements: input.engagements.filter((e) => e.status === "active").length,
    completedInterviews: input.interviews.filter((i) => i.status === "completed").length,
    brdCount: input.brds.length,
    frsCount: input.frsDocuments.length,
    userStoryCount: input.userStories.length,
    acceptanceCriteriaCount: input.acceptanceCriteria.length,
    processMapCount: input.processMaps.length,
    gapAnalysisCount: input.gapAnalyses.length,
    openRisks: input.risks.filter((r) => r.status === "open").length,
    stakeholderCount: input.stakeholders.length,
    scopeItemCount: input.scopeItems.length,
    proposalCount: input.proposals.length,
    pendingApprovals: input.approvals.filter((a) => a.approvalStatus === "pending").length,
    versionCount: input.versions.length,
});

export const buildBaPipelineInfo = (): BaPipelineInfo => ({
    stages: [
        { key: "customer_requirement", label: "Customer Requirement" },
        { key: "requirement_interview", label: "AI Business Analyst" },
        { key: "solution_architect", label: "AI Solution Architect" },
        { key: "development_factory", label: "AI Development Factory" },
        { key: "qa", label: "AI QA" },
        { key: "deployment", label: "Deployment" },
    ],
    currentWorker: "AI Business Analyst",
    nextWorker: "AI Solution Architect",
});

export const buildEngagementPayload = (organizationId: string, input: CreateEngagementInput) => ({
    organization_id: organizationId, title: input.title, engagement_key: input.engagementKey, client_id: input.clientId || null, project_id: input.projectId || null, agent_id: input.agentId || null, session_id: input.sessionId || null, knowledge_context_id: input.knowledgeContextId || null, pipeline_stage: input.pipelineStage ?? "requirement_interview", summary: input.summary ?? "",
});

export const buildInterviewPayload = (organizationId: string, input: CreateInterviewInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, interview_key: input.interviewKey, stakeholder_name: input.stakeholderName, questions: input.questions ?? [], responses: input.responses ?? [], status: input.status ?? "in_progress",
});

export const buildBrdPayload = (organizationId: string, input: CreateBrdInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, title: input.title, executive_summary: input.executiveSummary, business_objectives: input.businessObjectives ?? "", scope_overview: input.scopeOverview ?? "", content: input.content ?? "",
});

export const buildFrsPayload = (organizationId: string, input: CreateFrsInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, brd_id: input.brdId || null, title: input.title, functional_requirements: input.functionalRequirements, non_functional_requirements: input.nonFunctionalRequirements ?? "", content: input.content ?? "",
});

export const buildUserStoryPayload = (organizationId: string, input: CreateUserStoryInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, frs_id: input.frsId || null, story_key: input.storyKey, title: input.title, description: input.description ?? "", persona: input.persona ?? "", priority: input.priority ?? "medium",
});

export const buildAcceptanceCriterionPayload = (organizationId: string, input: CreateAcceptanceCriterionInput) => ({
    organization_id: organizationId, user_story_id: input.userStoryId, criterion_key: input.criterionKey, description: input.description, test_scenario: input.testScenario ?? "",
});

export const buildProcessMapPayload = (organizationId: string, input: CreateProcessMapInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, process_type: input.processType ?? "as_is", steps: input.steps ?? [], description: input.description ?? "",
});

export const buildGapAnalysisPayload = (organizationId: string, input: CreateGapAnalysisInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, current_state: input.currentState, desired_state: input.desiredState, gaps: input.gaps ?? [], recommendations: input.recommendations ?? "",
});

export const buildFeaturePriorityPayload = (organizationId: string, input: CreateFeaturePriorityInput, rank: number) => ({
    organization_id: organizationId, engagement_id: input.engagementId, feature_name: input.featureName, priority_score: input.priorityScore, priority_rank: rank, rationale: input.rationale ?? "",
});

export const buildRiskPayload = (organizationId: string, input: CreateRiskInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, risk_key: input.riskKey, title: input.title, description: input.description ?? "", likelihood: input.likelihood ?? "medium", impact: input.impact ?? "medium", mitigation: input.mitigation ?? "",
});

export const buildStakeholderPayload = (organizationId: string, input: CreateStakeholderInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, name: input.name, role: input.role ?? "", influence: input.influence ?? "medium", interest: input.interest ?? "medium", contact_info: input.contactInfo ?? "",
});

export const buildScopeItemPayload = (organizationId: string, input: CreateScopeItemInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, item_key: input.itemKey, title: input.title, scope_type: input.scopeType ?? "in_scope", description: input.description ?? "",
});

export const buildProposalPayload = (organizationId: string, input: CreateProposalInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, title: input.title, executive_summary: input.executiveSummary, deliverables: input.deliverables ?? "", content: input.content ?? "",
});

export const buildCostEstimatePayload = (organizationId: string, input: CreateCostEstimateInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, estimate_key: input.estimateKey, line_items: input.lineItems ?? [], total_amount: input.totalAmount, currency: input.currency ?? "INR", assumptions: input.assumptions ?? "",
});

export const buildTimelineEstimatePayload = (organizationId: string, input: CreateTimelineEstimateInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, estimate_key: input.estimateKey, phases: input.phases ?? [], total_duration_days: input.totalDurationDays, assumptions: input.assumptions ?? "",
});

export const buildVersionPayload = (organizationId: string, input: CreateVersionInput, versionNumber: number) => ({
    organization_id: organizationId, engagement_id: input.engagementId, entity_type: input.entityType, entity_id: input.entityId, version_number: versionNumber, content: input.content, change_summary: input.changeSummary,
});

export const buildReviewApprovalPayload = (organizationId: string, input: CreateReviewApprovalInput) => ({
    organization_id: organizationId, engagement_id: input.engagementId, entity_type: input.entityType, entity_id: input.entityId || null, reviewer_id: input.reviewerId || null, approval_status: input.approvalStatus ?? "pending", comments: input.comments ?? "",
});

export const buildBaAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId, entity_type: entityType, entity_id: entityId ?? null, action, summary, metadata: {},
});
