export type FounderOsTab =
    | "overview"
    | "workspaces"
    | "strategicOkrs"
    | "executiveDashboards"
    | "revenueRunway"
    | "teamCapacity"
    | "productRoadmaps"
    | "investorRelations"
    | "boardReports"
    | "decisionLog"
    | "priorities"
    | "resourceAllocations"
    | "riskRegister"
    | "growthMetrics"
    | "founderAgenda"
    | "stakeholders"
    | "capitalPlans"
    | "companyMilestones"
    | "founderInsights"
    | "audit"
    | "api";

export interface FoDashboardStats {
    totalWorkspaces: number;
    activeWorkspaces: number;
    strategicOkrCount: number;
    executiveDashboardCount: number;
    revenueRunwayCount: number;
    teamCapacityCount: number;
    productRoadmapCount: number;
    investorRelationCount: number;
    boardReportCount: number;
    decisionLogCount: number;
    priorityCount: number;
    resourceAllocationCount: number;
    riskRegisterCount: number;
    growthMetricCount: number;
    founderAgendaCount: number;
    stakeholderCount: number;
    capitalPlanCount: number;
    companyMilestoneCount: number;
    founderInsightCount: number;
    avgRunwayMonths: number;
    avgGrowthRatePercent: number;
}

export interface FoPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentWorker: string;
    nextWorker: string;
    previousWorker: string;
}

export interface WorkspaceSummary {
    id: string;
    title: string;
    workspaceKey: string;
    baEngagementTitle?: string | null;
    saEngagementTitle?: string | null;
    dfEngagementTitle?: string | null;
    qaEngagementTitle?: string | null;
    ddEngagementTitle?: string | null;
    csEngagementTitle?: string | null;
    clientName?: string | null;
    projectName?: string | null;
    agentName?: string | null;
    pipelineStage: string;
    status: string;
    summaryPreview: string;
    updatedAt: string;
}

export interface StrategicOkrSummary {
    id: string;
    workspaceTitle: string;
    okrKey: string;
    title: string;
    quarter: string;
    keyResultCount: number;
    status: string;
}

export interface ExecutiveDashboardSummary {
    id: string;
    workspaceTitle: string;
    dashboardKey: string;
    name: string;
    widgetCount: number;
    refreshCadence: string;
    status: string;
}

export interface RevenueRunwaySummary {
    id: string;
    workspaceTitle: string;
    runwayKey: string;
    name: string;
    monthlyBurnUsd: number;
    cashBalanceUsd: number;
    runwayMonths: number;
    status: string;
}

export interface TeamCapacitySummary {
    id: string;
    workspaceTitle: string;
    capacityKey: string;
    name: string;
    utilizationPercent: number;
    status: string;
}

export interface ProductRoadmapSummary {
    id: string;
    workspaceTitle: string;
    roadmapKey: string;
    name: string;
    initiativeCount: number;
    status: string;
}

export interface InvestorRelationSummary {
    id: string;
    workspaceTitle: string;
    relationKey: string;
    investorName: string;
    round: string;
    nextTouchpoint?: string | null;
    status: string;
}

export interface BoardReportSummary {
    id: string;
    workspaceTitle: string;
    reportKey: string;
    title: string;
    reportingPeriod: string;
    sectionCount: number;
    status: string;
}

export interface DecisionLogSummary {
    id: string;
    workspaceTitle: string;
    decisionKey: string;
    title: string;
    decisionType: string;
    outcomePreview: string;
    status: string;
}

export interface PrioritySummary {
    id: string;
    workspaceTitle: string;
    priorityKey: string;
    title: string;
    priorityLevel: string;
    owner: string;
    dueDate?: string | null;
    status: string;
}

export interface ResourceAllocationSummary {
    id: string;
    workspaceTitle: string;
    allocationKey: string;
    name: string;
    budgetUsd: number;
    status: string;
}

export interface RiskRegisterSummary {
    id: string;
    workspaceTitle: string;
    riskKey: string;
    title: string;
    riskLevel: string;
    owner: string;
    status: string;
}

export interface GrowthMetricSummary {
    id: string;
    workspaceTitle: string;
    metricKey: string;
    name: string;
    metricType: string;
    currentValue: number;
    targetValue: number;
    growthRatePercent: number;
    status: string;
}

export interface FounderAgendaSummary {
    id: string;
    workspaceTitle: string;
    agendaKey: string;
    title: string;
    scheduledAt?: string | null;
    itemCount: number;
    status: string;
}

export interface StakeholderSummary {
    id: string;
    workspaceTitle: string;
    stakeholderKey: string;
    name: string;
    stakeholderType: string;
    influenceLevel: string;
    status: string;
}

export interface CapitalPlanSummary {
    id: string;
    workspaceTitle: string;
    planKey: string;
    name: string;
    fundingTargetUsd: number;
    timeline: string;
    status: string;
}

export interface CompanyMilestoneSummary {
    id: string;
    workspaceTitle: string;
    milestoneKey: string;
    title: string;
    targetDate?: string | null;
    milestoneType: string;
    status: string;
}

export interface FounderInsightSummary {
    id: string;
    workspaceTitle: string;
    insightKey: string;
    title: string;
    insightType: string;
    contentPreview: string;
    confidenceScore: number;
    status: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    createdAt: string;
}

export interface CreateWorkspaceInput {
    title: string;
    workspaceKey: string;
    baEngagementId?: string;
    saEngagementId?: string;
    dfEngagementId?: string;
    qaEngagementId?: string;
    ddEngagementId?: string;
    csEngagementId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
    knowledgeContextId?: string;
    pipelineStage?: string;
    summary?: string;
}

export interface CreateStrategicOkrInput {
    workspaceId: string;
    okrKey: string;
    title: string;
    objective?: string;
    keyResults?: unknown[];
    quarter?: string;
}

export interface CreateExecutiveDashboardInput {
    workspaceId: string;
    dashboardKey: string;
    name: string;
    widgets?: unknown[];
    refreshCadence?: string;
}

export interface CreateRevenueRunwayInput {
    workspaceId: string;
    runwayKey: string;
    name: string;
    monthlyBurnUsd?: number;
    cashBalanceUsd?: number;
    runwayMonths?: number;
    revenueForecast?: unknown[];
}

export interface CreateTeamCapacityInput {
    workspaceId: string;
    capacityKey: string;
    name: string;
    teamAllocations?: unknown[];
    utilizationPercent?: number;
}

export interface CreateProductRoadmapInput {
    workspaceId: string;
    roadmapKey: string;
    name: string;
    initiatives?: unknown[];
    timelineQuarters?: unknown[];
}

export interface CreateInvestorRelationInput {
    workspaceId: string;
    relationKey: string;
    investorName: string;
    round?: string;
    engagementNotes?: string;
    nextTouchpoint?: string;
}

export interface CreateBoardReportInput {
    workspaceId: string;
    reportKey: string;
    title: string;
    reportingPeriod?: string;
    sections?: unknown[];
}

export interface CreateDecisionLogInput {
    workspaceId: string;
    decisionKey: string;
    title: string;
    decisionType?: string;
    rationale?: string;
    outcome?: string;
}

export interface CreatePriorityInput {
    workspaceId: string;
    priorityKey: string;
    title: string;
    priorityLevel?: string;
    owner?: string;
    dueDate?: string;
}

export interface CreateResourceAllocationInput {
    workspaceId: string;
    allocationKey: string;
    name: string;
    budgetUsd?: number;
    allocations?: unknown[];
}

export interface CreateRiskRegisterInput {
    workspaceId: string;
    riskKey: string;
    title: string;
    riskLevel?: string;
    mitigationPlan?: string;
    owner?: string;
}

export interface CreateGrowthMetricInput {
    workspaceId: string;
    metricKey: string;
    name: string;
    metricType?: string;
    currentValue?: number;
    targetValue?: number;
    growthRatePercent?: number;
}

export interface CreateFounderAgendaInput {
    workspaceId: string;
    agendaKey: string;
    title: string;
    scheduledAt?: string;
    agendaItems?: unknown[];
}

export interface CreateStakeholderInput {
    workspaceId: string;
    stakeholderKey: string;
    name: string;
    stakeholderType?: string;
    influenceLevel?: string;
    engagementPlan?: string;
}

export interface CreateCapitalPlanInput {
    workspaceId: string;
    planKey: string;
    name: string;
    fundingTargetUsd?: number;
    useOfFunds?: unknown[];
    timeline?: string;
}

export interface CreateCompanyMilestoneInput {
    workspaceId: string;
    milestoneKey: string;
    title: string;
    targetDate?: string;
    milestoneType?: string;
    successCriteria?: string;
}

export interface CreateFounderInsightInput {
    workspaceId: string;
    insightKey: string;
    title: string;
    insightType?: string;
    content?: string;
    confidenceScore?: number;
}

export interface FoSdkStartWorkspaceInput {
    title: string;
    workspaceKey: string;
    baEngagementId?: string;
    saEngagementId?: string;
    dfEngagementId?: string;
    qaEngagementId?: string;
    ddEngagementId?: string;
    csEngagementId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
}

export interface FoSdkStartWorkspaceResult {
    workspaceId: string;
    workspaceKey: string;
    pipelineStage: string;
    aiTaskId?: string | null;
}

export interface FoSdkGenerateArtifactInput {
    workspaceId: string;
    artifactType: "strategic_okr" | "board_report" | "founder_insight" | "executive_dashboard";
    title: string;
    content: string;
}

export interface FoSdkGenerateArtifactResult {
    artifactId: string;
    artifactType: string;
    status: string;
}

export interface FoSdkRunAnalysisInput {
    workspaceId: string;
    analysisType: "runway" | "growth" | "risk";
    inputPayload: Record<string, unknown>;
}

export interface FoSdkRunAnalysisResult {
    analysisId: string;
    analysisType: string;
    status: string;
}
