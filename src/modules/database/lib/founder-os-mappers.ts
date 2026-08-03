import type {
    DbAiOrchestrationAgent,
    DbAiSession,
    DbBaEngagement,
    DbClient,
    DbCsEngagement,
    DbDdEngagement,
    DbDfEngagement,
    DbExpense,
    DbInvoice,
    DbFoAuditLog,
    DbFoBoardReport,
    DbFoCapitalPlan,
    DbFoCompanyMilestone,
    DbFoDecisionLog,
    DbFoExecutiveDashboard,
    DbFoFounderAgenda,
    DbFoFounderInsight,
    DbFoGrowthMetric,
    DbFoInvestorRelation,
    DbFoPriority,
    DbFoProductRoadmap,
    DbFoResourceAllocation,
    DbFoRevenueRunway,
    DbFoRiskRegister,
    DbFoStakeholder,
    DbFoStrategicOkr,
    DbFoTeamCapacity,
    DbFoWorkspace,
    DbProject,
    DbQaEngagement,
    DbSaEngagement,
} from "@/src/modules/database/types/platform";
import type {
    AuditEntry,
    BoardReportSummary,
    CapitalPlanSummary,
    CompanyMilestoneSummary,
    CreateBoardReportInput,
    CreateCapitalPlanInput,
    CreateCompanyMilestoneInput,
    CreateDecisionLogInput,
    CreateExecutiveDashboardInput,
    CreateFounderAgendaInput,
    CreateFounderInsightInput,
    CreateGrowthMetricInput,
    CreateInvestorRelationInput,
    CreatePriorityInput,
    CreateProductRoadmapInput,
    CreateResourceAllocationInput,
    CreateRevenueRunwayInput,
    CreateRiskRegisterInput,
    CreateStakeholderInput,
    CreateStrategicOkrInput,
    CreateTeamCapacityInput,
    CreateWorkspaceInput,
    DecisionLogSummary,
    ExecutiveDashboardSummary,
    FoDashboardStats,
    FoPipelineInfo,
    FounderAgendaSummary,
    FounderInsightSummary,
    GrowthMetricSummary,
    InvestorRelationSummary,
    PrioritySummary,
    ProductRoadmapSummary,
    ResourceAllocationSummary,
    RevenueRunwaySummary,
    RiskRegisterSummary,
    StakeholderSummary,
    StrategicOkrSummary,
    TeamCapacitySummary,
    WorkspaceSummary,
} from "@/src/modules/founder-os/types";

type LookupMaps = {
    workspaces: Map<string, DbFoWorkspace>;
    baEngagements: Map<string, DbBaEngagement>;
    saEngagements: Map<string, DbSaEngagement>;
    dfEngagements: Map<string, DbDfEngagement>;
    qaEngagements: Map<string, DbQaEngagement>;
    ddEngagements: Map<string, DbDdEngagement>;
    csEngagements: Map<string, DbCsEngagement>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
    invoices: Map<string, DbInvoice>;
    expenses: Map<string, DbExpense>;
};

export const buildLookupMaps = (
    workspaces: DbFoWorkspace[],
    baEngagements: DbBaEngagement[],
    saEngagements: DbSaEngagement[],
    dfEngagements: DbDfEngagement[],
    qaEngagements: DbQaEngagement[],
    ddEngagements: DbDdEngagement[],
    csEngagements: DbCsEngagement[],
    clients: DbClient[],
    projects: DbProject[],
    agents: DbAiOrchestrationAgent[],
    sessions: DbAiSession[],
    invoices: DbInvoice[],
    expenses: DbExpense[],
): LookupMaps => ({
    workspaces: new Map(workspaces.map((item) => [item.id, item])),
    baEngagements: new Map(baEngagements.map((item) => [item.id, item])),
    saEngagements: new Map(saEngagements.map((item) => [item.id, item])),
    dfEngagements: new Map(dfEngagements.map((item) => [item.id, item])),
    qaEngagements: new Map(qaEngagements.map((item) => [item.id, item])),
    ddEngagements: new Map(ddEngagements.map((item) => [item.id, item])),
    csEngagements: new Map(csEngagements.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    agents: new Map(agents.map((item) => [item.id, item])),
    sessions: new Map(sessions.map((item) => [item.id, item])),
    invoices: new Map(invoices.map((item) => [item.id, item])),
    expenses: new Map(expenses.map((item) => [item.id, item])),
});

const workspaceTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.workspaces.get(id)?.title ?? null : null);
const baEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.baEngagements.get(id)?.title ?? null : null);
const saEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.saEngagements.get(id)?.title ?? null : null);
const dfEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.dfEngagements.get(id)?.title ?? null : null);
const qaEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.qaEngagements.get(id)?.title ?? null : null);
const ddEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.ddEngagements.get(id)?.title ?? null : null);
const csEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.csEngagements.get(id)?.title ?? null : null);
const clientName = (maps: LookupMaps, id?: string | null) => (id ? maps.clients.get(id)?.name ?? null : null);
const projectName = (maps: LookupMaps, id?: string | null) => (id ? maps.projects.get(id)?.name ?? null : null);
const agentName = (maps: LookupMaps, id?: string | null) => (id ? maps.agents.get(id)?.name ?? null : null);

export const mapWorkspaceSummary = (record: DbFoWorkspace, maps: LookupMaps): WorkspaceSummary => ({
    id: record.id,
    title: record.title,
    workspaceKey: record.workspace_key,
    baEngagementTitle: baEngagementTitle(maps, record.ba_engagement_id),
    saEngagementTitle: saEngagementTitle(maps, record.sa_engagement_id),
    dfEngagementTitle: dfEngagementTitle(maps, record.df_engagement_id),
    qaEngagementTitle: qaEngagementTitle(maps, record.qa_engagement_id),
    ddEngagementTitle: ddEngagementTitle(maps, record.dd_engagement_id),
    csEngagementTitle: csEngagementTitle(maps, record.cs_engagement_id),
    clientName: clientName(maps, record.client_id),
    projectName: projectName(maps, record.project_id),
    agentName: agentName(maps, record.agent_id),
    pipelineStage: record.pipeline_stage,
    status: record.status,
    summaryPreview: record.summary.slice(0, 120),
    updatedAt: record.updated_at,
});

export const mapStrategicOkrSummary = (record: DbFoStrategicOkr, maps: LookupMaps): StrategicOkrSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    okrKey: record.okr_key,
    title: record.title,
    quarter: record.quarter,
    keyResultCount: Array.isArray(record.key_results) ? record.key_results.length : 0,
    status: record.status,
});

export const mapExecutiveDashboardSummary = (record: DbFoExecutiveDashboard, maps: LookupMaps): ExecutiveDashboardSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    dashboardKey: record.dashboard_key,
    name: record.name,
    widgetCount: Array.isArray(record.widgets) ? record.widgets.length : 0,
    refreshCadence: record.refresh_cadence,
    status: record.status,
});

export const mapRevenueRunwaySummary = (record: DbFoRevenueRunway, maps: LookupMaps): RevenueRunwaySummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    runwayKey: record.runway_key,
    name: record.name,
    monthlyBurnUsd: record.monthly_burn_usd,
    cashBalanceUsd: record.cash_balance_usd,
    runwayMonths: record.runway_months,
    status: record.status,
});

export const mapTeamCapacitySummary = (record: DbFoTeamCapacity, maps: LookupMaps): TeamCapacitySummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    capacityKey: record.capacity_key,
    name: record.name,
    utilizationPercent: record.utilization_percent,
    status: record.status,
});

export const mapProductRoadmapSummary = (record: DbFoProductRoadmap, maps: LookupMaps): ProductRoadmapSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    roadmapKey: record.roadmap_key,
    name: record.name,
    initiativeCount: Array.isArray(record.initiatives) ? record.initiatives.length : 0,
    status: record.status,
});

export const mapInvestorRelationSummary = (record: DbFoInvestorRelation, maps: LookupMaps): InvestorRelationSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    relationKey: record.relation_key,
    investorName: record.investor_name,
    round: record.round,
    nextTouchpoint: record.next_touchpoint,
    status: record.status,
});

export const mapBoardReportSummary = (record: DbFoBoardReport, maps: LookupMaps): BoardReportSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    reportKey: record.report_key,
    title: record.title,
    reportingPeriod: record.reporting_period,
    sectionCount: Array.isArray(record.sections) ? record.sections.length : 0,
    status: record.status,
});

export const mapDecisionLogSummary = (record: DbFoDecisionLog, maps: LookupMaps): DecisionLogSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    decisionKey: record.decision_key,
    title: record.title,
    decisionType: record.decision_type,
    outcomePreview: record.outcome.slice(0, 80),
    status: record.status,
});

export const mapPrioritySummary = (record: DbFoPriority, maps: LookupMaps): PrioritySummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    priorityKey: record.priority_key,
    title: record.title,
    priorityLevel: record.priority_level,
    owner: record.owner,
    dueDate: record.due_date,
    status: record.status,
});

export const mapResourceAllocationSummary = (record: DbFoResourceAllocation, maps: LookupMaps): ResourceAllocationSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    allocationKey: record.allocation_key,
    name: record.name,
    budgetUsd: record.budget_usd,
    status: record.status,
});

export const mapRiskRegisterSummary = (record: DbFoRiskRegister, maps: LookupMaps): RiskRegisterSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    riskKey: record.risk_key,
    title: record.title,
    riskLevel: record.risk_level,
    owner: record.owner,
    status: record.status,
});

export const mapGrowthMetricSummary = (record: DbFoGrowthMetric, maps: LookupMaps): GrowthMetricSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    metricKey: record.metric_key,
    name: record.name,
    metricType: record.metric_type,
    currentValue: record.current_value,
    targetValue: record.target_value,
    growthRatePercent: record.growth_rate_percent,
    status: record.status,
});

export const mapFounderAgendaSummary = (record: DbFoFounderAgenda, maps: LookupMaps): FounderAgendaSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    agendaKey: record.agenda_key,
    title: record.title,
    scheduledAt: record.scheduled_at,
    itemCount: Array.isArray(record.agenda_items) ? record.agenda_items.length : 0,
    status: record.status,
});

export const mapStakeholderSummary = (record: DbFoStakeholder, maps: LookupMaps): StakeholderSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    stakeholderKey: record.stakeholder_key,
    name: record.name,
    stakeholderType: record.stakeholder_type,
    influenceLevel: record.influence_level,
    status: record.status,
});

export const mapCapitalPlanSummary = (record: DbFoCapitalPlan, maps: LookupMaps): CapitalPlanSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    planKey: record.plan_key,
    name: record.name,
    fundingTargetUsd: record.funding_target_usd,
    timeline: record.timeline,
    status: record.status,
});

export const mapCompanyMilestoneSummary = (record: DbFoCompanyMilestone, maps: LookupMaps): CompanyMilestoneSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    milestoneKey: record.milestone_key,
    title: record.title,
    targetDate: record.target_date,
    milestoneType: record.milestone_type,
    status: record.status,
});

export const mapFounderInsightSummary = (record: DbFoFounderInsight, maps: LookupMaps): FounderInsightSummary => ({
    id: record.id,
    workspaceTitle: workspaceTitle(maps, record.workspace_id) ?? "",
    insightKey: record.insight_key,
    title: record.title,
    insightType: record.insight_type,
    contentPreview: record.content.slice(0, 80),
    confidenceScore: record.confidence_score,
    status: record.status,
});

export const mapAuditEntry = (record: DbFoAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id,
    action: record.action,
    summary: record.summary,
    createdAt: record.created_at,
});

export const buildFoDashboardStats = (input: {
    workspaces: WorkspaceSummary[];
    strategicOkrs: StrategicOkrSummary[];
    executiveDashboards: ExecutiveDashboardSummary[];
    revenueRunway: RevenueRunwaySummary[];
    teamCapacity: TeamCapacitySummary[];
    productRoadmaps: ProductRoadmapSummary[];
    investorRelations: InvestorRelationSummary[];
    boardReports: BoardReportSummary[];
    decisionLog: DecisionLogSummary[];
    priorities: PrioritySummary[];
    resourceAllocations: ResourceAllocationSummary[];
    riskRegister: RiskRegisterSummary[];
    growthMetrics: GrowthMetricSummary[];
    founderAgenda: FounderAgendaSummary[];
    stakeholders: StakeholderSummary[];
    capitalPlans: CapitalPlanSummary[];
    companyMilestones: CompanyMilestoneSummary[];
    founderInsights: FounderInsightSummary[];
}): FoDashboardStats => ({
    totalWorkspaces: input.workspaces.length,
    activeWorkspaces: input.workspaces.filter((w) => w.status === "active").length,
    strategicOkrCount: input.strategicOkrs.length,
    executiveDashboardCount: input.executiveDashboards.length,
    revenueRunwayCount: input.revenueRunway.length,
    teamCapacityCount: input.teamCapacity.length,
    productRoadmapCount: input.productRoadmaps.length,
    investorRelationCount: input.investorRelations.length,
    boardReportCount: input.boardReports.length,
    decisionLogCount: input.decisionLog.length,
    priorityCount: input.priorities.length,
    resourceAllocationCount: input.resourceAllocations.length,
    riskRegisterCount: input.riskRegister.length,
    growthMetricCount: input.growthMetrics.length,
    founderAgendaCount: input.founderAgenda.length,
    stakeholderCount: input.stakeholders.length,
    capitalPlanCount: input.capitalPlans.length,
    companyMilestoneCount: input.companyMilestones.length,
    founderInsightCount: input.founderInsights.length,
    avgRunwayMonths: input.revenueRunway.length ? input.revenueRunway.reduce((s, r) => s + r.runwayMonths, 0) / input.revenueRunway.length : 0,
    avgGrowthRatePercent: input.growthMetrics.length ? input.growthMetrics.reduce((s, g) => s + g.growthRatePercent, 0) / input.growthMetrics.length : 0,
});

export const buildFoPipelineInfo = (): FoPipelineInfo => ({
    stages: [
        { key: "customer_requirement", label: "Customer Requirement" },
        { key: "business_analyst", label: "AI Business Analyst" },
        { key: "architecture_design", label: "AI Solution Architect" },
        { key: "development_factory", label: "AI Development Factory" },
        { key: "qa_engineering", label: "AI QA Engineering" },
        { key: "devops_deployment", label: "AI DevOps & Deployment" },
        { key: "customer_success", label: "AI Customer Success Manager" },
        { key: "founder_operating_system", label: "Founder Operating System" },
        { key: "strategic_execution", label: "Strategic Execution" },
    ],
    currentWorker: "Founder Operating System",
    nextWorker: "Strategic Execution",
    previousWorker: "AI Customer Success Manager",
});

export const buildWorkspacePayload = (organizationId: string, input: CreateWorkspaceInput) => ({
    organization_id: organizationId,
    title: input.title,
    workspace_key: input.workspaceKey,
    ba_engagement_id: input.baEngagementId || null,
    sa_engagement_id: input.saEngagementId || null,
    df_engagement_id: input.dfEngagementId || null,
    qa_engagement_id: input.qaEngagementId || null,
    dd_engagement_id: input.ddEngagementId || null,
    cs_engagement_id: input.csEngagementId || null,
    client_id: input.clientId || null,
    project_id: input.projectId || null,
    agent_id: input.agentId || null,
    session_id: input.sessionId || null,
    knowledge_context_id: input.knowledgeContextId || null,
    pipeline_stage: input.pipelineStage ?? "founder_operating_system",
    summary: input.summary ?? "",
});

export const buildStrategicOkrPayload = (organizationId: string, input: CreateStrategicOkrInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    okr_key: input.okrKey,
    title: input.title,
    objective: input.objective ?? "",
    key_results: input.keyResults ?? [],
    quarter: input.quarter ?? "",
});

export const buildExecutiveDashboardPayload = (organizationId: string, input: CreateExecutiveDashboardInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    dashboard_key: input.dashboardKey,
    name: input.name,
    widgets: input.widgets ?? [],
    refresh_cadence: input.refreshCadence ?? "weekly",
});

export const buildRevenueRunwayPayload = (organizationId: string, input: CreateRevenueRunwayInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    runway_key: input.runwayKey,
    name: input.name,
    monthly_burn_usd: input.monthlyBurnUsd ?? 0,
    cash_balance_usd: input.cashBalanceUsd ?? 0,
    runway_months: input.runwayMonths ?? 0,
    revenue_forecast: input.revenueForecast ?? [],
});

export const buildTeamCapacityPayload = (organizationId: string, input: CreateTeamCapacityInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    capacity_key: input.capacityKey,
    name: input.name,
    team_allocations: input.teamAllocations ?? [],
    utilization_percent: input.utilizationPercent ?? 0,
});

export const buildProductRoadmapPayload = (organizationId: string, input: CreateProductRoadmapInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    roadmap_key: input.roadmapKey,
    name: input.name,
    initiatives: input.initiatives ?? [],
    timeline_quarters: input.timelineQuarters ?? [],
});

export const buildInvestorRelationPayload = (organizationId: string, input: CreateInvestorRelationInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    relation_key: input.relationKey,
    investor_name: input.investorName,
    round: input.round ?? "",
    engagement_notes: input.engagementNotes ?? "",
    next_touchpoint: input.nextTouchpoint ?? null,
});

export const buildBoardReportPayload = (organizationId: string, input: CreateBoardReportInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    report_key: input.reportKey,
    title: input.title,
    reporting_period: input.reportingPeriod ?? "",
    sections: input.sections ?? [],
});

export const buildDecisionLogPayload = (organizationId: string, input: CreateDecisionLogInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    decision_key: input.decisionKey,
    title: input.title,
    decision_type: input.decisionType ?? "operational",
    rationale: input.rationale ?? "",
    outcome: input.outcome ?? "",
});

export const buildPriorityPayload = (organizationId: string, input: CreatePriorityInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    priority_key: input.priorityKey,
    title: input.title,
    priority_level: input.priorityLevel ?? "medium",
    owner: input.owner ?? "",
    due_date: input.dueDate ?? null,
});

export const buildResourceAllocationPayload = (organizationId: string, input: CreateResourceAllocationInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    allocation_key: input.allocationKey,
    name: input.name,
    budget_usd: input.budgetUsd ?? 0,
    allocations: input.allocations ?? [],
});

export const buildRiskRegisterPayload = (organizationId: string, input: CreateRiskRegisterInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    risk_key: input.riskKey,
    title: input.title,
    risk_level: input.riskLevel ?? "medium",
    mitigation_plan: input.mitigationPlan ?? "",
    owner: input.owner ?? "",
});

export const buildGrowthMetricPayload = (organizationId: string, input: CreateGrowthMetricInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    metric_key: input.metricKey,
    name: input.name,
    metric_type: input.metricType ?? "revenue",
    current_value: input.currentValue ?? 0,
    target_value: input.targetValue ?? 0,
    growth_rate_percent: input.growthRatePercent ?? 0,
});

export const buildFounderAgendaPayload = (organizationId: string, input: CreateFounderAgendaInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    agenda_key: input.agendaKey,
    title: input.title,
    scheduled_at: input.scheduledAt ?? null,
    agenda_items: input.agendaItems ?? [],
});

export const buildStakeholderPayload = (organizationId: string, input: CreateStakeholderInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    stakeholder_key: input.stakeholderKey,
    name: input.name,
    stakeholder_type: input.stakeholderType ?? "investor",
    influence_level: input.influenceLevel ?? "medium",
    engagement_plan: input.engagementPlan ?? "",
});

export const buildCapitalPlanPayload = (organizationId: string, input: CreateCapitalPlanInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    plan_key: input.planKey,
    name: input.name,
    funding_target_usd: input.fundingTargetUsd ?? 0,
    use_of_funds: input.useOfFunds ?? [],
    timeline: input.timeline ?? "",
});

export const buildCompanyMilestonePayload = (organizationId: string, input: CreateCompanyMilestoneInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    milestone_key: input.milestoneKey,
    title: input.title,
    target_date: input.targetDate ?? null,
    milestone_type: input.milestoneType ?? "product",
    success_criteria: input.successCriteria ?? "",
});

export const buildFounderInsightPayload = (organizationId: string, input: CreateFounderInsightInput) => ({
    organization_id: organizationId,
    workspace_id: input.workspaceId,
    insight_key: input.insightKey,
    title: input.title,
    insight_type: input.insightType ?? "strategic",
    content: input.content ?? "",
    confidence_score: input.confidenceScore ?? 0,
});

export const buildFoAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
});
