import type {
    DbAcActivityFeed,
    DbAcApprovalWorkflow,
    DbAcAuditLog,
    DbAcBusinessKpi,
    DbAcCommandPalette,
    DbAcCompanyContext,
    DbAcCompanyTimeline,
    DbAcComplianceDashboard,
    DbAcCrossModuleAutomation,
    DbAcEmergencyWorkflow,
    DbAcEventBusEvent,
    DbAcExecutiveInsight,
    DbAcNotificationCenter,
    DbAcOperationalHealth,
    DbAcPredictiveRecommendation,
    DbAcSecurityGovernance,
    DbAcSystemSearch,
    DbAcWorkerCollaboration,
    DbAcWorkflowOrchestration,
    DbAiOrchestrationAgent,
    DbAiSession,
    DbBaEngagement,
    DbClient,
    DbCsEngagement,
    DbDdEngagement,
    DbDfEngagement,
    DbFoWorkspace,
    DbProject,
    DbQaEngagement,
    DbSaEngagement,
} from "@/src/modules/database/types/platform";
import type {
    AcDashboardStats,
    AcPipelineInfo,
    ActivityFeedSummary,
    ApprovalWorkflowSummary,
    AuditEntry,
    AutomationSummary,
    BusinessKpiSummary,
    CommandPaletteSummary,
    CompanyContextSummary,
    ComplianceDashboardSummary,
    CreateActivityFeedInput,
    CreateApprovalWorkflowInput,
    CreateAutomationInput,
    CreateBusinessKpiInput,
    CreateCommandPaletteInput,
    CreateCompanyContextInput,
    CreateComplianceDashboardInput,
    CreateEmergencyWorkflowInput,
    CreateEventBusInput,
    CreateExecutiveInsightInput,
    CreateNotificationInput,
    CreateOperationalHealthInput,
    CreatePredictiveRecommendationInput,
    CreateSecurityGovernanceInput,
    CreateSystemSearchInput,
    CreateTimelineInput,
    CreateWorkerCollaborationInput,
    CreateWorkflowOrchestrationInput,
    EmergencyWorkflowSummary,
    EventBusSummary,
    ExecutiveInsightSummary,
    NotificationSummary,
    OperationalHealthSummary,
    PredictiveRecommendationSummary,
    SecurityGovernanceSummary,
    SystemSearchSummary,
    TimelineSummary,
    WorkerCollaborationSummary,
    WorkflowOrchestrationSummary,
} from "@/src/modules/autonomous-company/types";

type LookupMaps = {
    contexts: Map<string, DbAcCompanyContext>;
    baEngagements: Map<string, DbBaEngagement>;
    saEngagements: Map<string, DbSaEngagement>;
    dfEngagements: Map<string, DbDfEngagement>;
    qaEngagements: Map<string, DbQaEngagement>;
    ddEngagements: Map<string, DbDdEngagement>;
    csEngagements: Map<string, DbCsEngagement>;
    foWorkspaces: Map<string, DbFoWorkspace>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
};

export const buildLookupMaps = (
    contexts: DbAcCompanyContext[],
    baEngagements: DbBaEngagement[],
    saEngagements: DbSaEngagement[],
    dfEngagements: DbDfEngagement[],
    qaEngagements: DbQaEngagement[],
    ddEngagements: DbDdEngagement[],
    csEngagements: DbCsEngagement[],
    foWorkspaces: DbFoWorkspace[],
    clients: DbClient[],
    projects: DbProject[],
    agents: DbAiOrchestrationAgent[],
    sessions: DbAiSession[],
): LookupMaps => ({
    contexts: new Map(contexts.map((item) => [item.id, item])),
    baEngagements: new Map(baEngagements.map((item) => [item.id, item])),
    saEngagements: new Map(saEngagements.map((item) => [item.id, item])),
    dfEngagements: new Map(dfEngagements.map((item) => [item.id, item])),
    qaEngagements: new Map(qaEngagements.map((item) => [item.id, item])),
    ddEngagements: new Map(ddEngagements.map((item) => [item.id, item])),
    csEngagements: new Map(csEngagements.map((item) => [item.id, item])),
    foWorkspaces: new Map(foWorkspaces.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    agents: new Map(agents.map((item) => [item.id, item])),
    sessions: new Map(sessions.map((item) => [item.id, item])),
});

const contextTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.contexts.get(id)?.title ?? null : null);
const foWorkspaceTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.foWorkspaces.get(id)?.title ?? null : null);
const baEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.baEngagements.get(id)?.title ?? null : null);
const saEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.saEngagements.get(id)?.title ?? null : null);
const dfEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.dfEngagements.get(id)?.title ?? null : null);
const qaEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.qaEngagements.get(id)?.title ?? null : null);
const ddEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.ddEngagements.get(id)?.title ?? null : null);
const csEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.csEngagements.get(id)?.title ?? null : null);
const clientName = (maps: LookupMaps, id?: string | null) => (id ? maps.clients.get(id)?.name ?? null : null);
const projectName = (maps: LookupMaps, id?: string | null) => (id ? maps.projects.get(id)?.name ?? null : null);
const agentName = (maps: LookupMaps, id?: string | null) => (id ? maps.agents.get(id)?.name ?? null : null);

export const mapCompanyContextSummary = (record: DbAcCompanyContext, maps: LookupMaps): CompanyContextSummary => ({
    id: record.id,
    title: record.title,
    contextKey: record.context_key,
    baEngagementTitle: baEngagementTitle(maps, record.ba_engagement_id),
    saEngagementTitle: saEngagementTitle(maps, record.sa_engagement_id),
    dfEngagementTitle: dfEngagementTitle(maps, record.df_engagement_id),
    qaEngagementTitle: qaEngagementTitle(maps, record.qa_engagement_id),
    ddEngagementTitle: ddEngagementTitle(maps, record.dd_engagement_id),
    csEngagementTitle: csEngagementTitle(maps, record.cs_engagement_id),
    foWorkspaceTitle: foWorkspaceTitle(maps, record.fo_workspace_id),
    clientName: clientName(maps, record.client_id),
    projectName: projectName(maps, record.project_id),
    agentName: agentName(maps, record.agent_id),
    pipelineStage: record.pipeline_stage,
    status: record.status,
    summaryPreview: record.summary.slice(0, 120),
    updatedAt: record.updated_at,
});

export const mapWorkflowOrchestrationSummary = (record: DbAcWorkflowOrchestration, maps: LookupMaps): WorkflowOrchestrationSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    orchestrationKey: record.orchestration_key,
    name: record.name,
    moduleCount: Array.isArray(record.participating_modules) ? record.participating_modules.length : 0,
    stepCount: Array.isArray(record.workflow_definition) ? record.workflow_definition.length : 0,
    status: record.status,
});

export const mapEventBusSummary = (record: DbAcEventBusEvent, maps: LookupMaps): EventBusSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    eventKey: record.event_key,
    name: record.name,
    sourceModule: record.source_module,
    targetCount: Array.isArray(record.target_modules) ? record.target_modules.length : 0,
    status: record.status,
});

export const mapWorkerCollaborationSummary = (record: DbAcWorkerCollaboration, maps: LookupMaps): WorkerCollaborationSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    collaborationKey: record.collaboration_key,
    name: record.name,
    workerCount: Array.isArray(record.participating_workers) ? record.participating_workers.length : 0,
    handoffCount: Array.isArray(record.handoff_rules) ? record.handoff_rules.length : 0,
    status: record.status,
});

export const mapApprovalWorkflowSummary = (record: DbAcApprovalWorkflow, maps: LookupMaps): ApprovalWorkflowSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    workflowKey: record.workflow_key,
    title: record.title,
    requiredRole: record.required_role,
    stepCount: Array.isArray(record.approval_steps) ? record.approval_steps.length : 0,
    status: record.status,
});

export const mapNotificationSummary = (record: DbAcNotificationCenter, maps: LookupMaps): NotificationSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    notificationKey: record.notification_key,
    title: record.title,
    channel: record.channel,
    priority: record.priority,
    status: record.status,
});

export const mapTimelineSummary = (record: DbAcCompanyTimeline, maps: LookupMaps): TimelineSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    timelineKey: record.timeline_key,
    title: record.title,
    eventType: record.event_type,
    eventAt: record.event_at,
    status: record.status,
});

export const mapActivityFeedSummary = (record: DbAcActivityFeed, maps: LookupMaps): ActivityFeedSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    feedKey: record.feed_key,
    actorName: record.actor_name,
    action: record.action,
    resourceType: record.resource_type,
    summary: record.summary,
    createdAt: record.created_at,
});

export const mapAutomationSummary = (record: DbAcCrossModuleAutomation, maps: LookupMaps): AutomationSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    automationKey: record.automation_key,
    name: record.name,
    triggerModule: record.trigger_module,
    actionCount: Array.isArray(record.action_modules) ? record.action_modules.length : 0,
    status: record.status,
});

export const mapExecutiveInsightSummary = (record: DbAcExecutiveInsight, maps: LookupMaps): ExecutiveInsightSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    insightKey: record.insight_key,
    title: record.title,
    insightType: record.insight_type,
    contentPreview: record.content.slice(0, 80),
    metricCount: Array.isArray(record.metrics) ? record.metrics.length : 0,
    status: record.status,
});

export const mapPredictiveRecommendationSummary = (record: DbAcPredictiveRecommendation, maps: LookupMaps): PredictiveRecommendationSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    recommendationKey: record.recommendation_key,
    title: record.title,
    recommendationType: record.recommendation_type,
    confidenceScore: record.confidence_score,
    status: record.status,
});

export const mapSystemSearchSummary = (record: DbAcSystemSearch, maps: LookupMaps): SystemSearchSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    searchKey: record.search_key,
    title: record.title,
    resourceType: record.resource_type,
    moduleSource: record.module_source,
    status: record.status,
});

export const mapCommandPaletteSummary = (record: DbAcCommandPalette, maps: LookupMaps): CommandPaletteSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    commandKey: record.command_key,
    label: record.label,
    actionType: record.action_type,
    targetPath: record.target_path,
    shortcut: record.shortcut,
    status: record.status,
});

export const mapEmergencyWorkflowSummary = (record: DbAcEmergencyWorkflow, maps: LookupMaps): EmergencyWorkflowSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    workflowKey: record.workflow_key,
    name: record.name,
    severity: record.severity,
    stepCount: Array.isArray(record.response_steps) ? record.response_steps.length : 0,
    status: record.status,
});

export const mapBusinessKpiSummary = (record: DbAcBusinessKpi, maps: LookupMaps): BusinessKpiSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    kpiKey: record.kpi_key,
    name: record.name,
    kpiCategory: record.kpi_category,
    currentValue: record.current_value,
    targetValue: record.target_value,
    unit: record.unit,
    status: record.status,
});

export const mapSecurityGovernanceSummary = (record: DbAcSecurityGovernance, maps: LookupMaps): SecurityGovernanceSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    governanceKey: record.governance_key,
    name: record.name,
    controlArea: record.control_area,
    complianceStatus: record.compliance_status,
    controlCount: Array.isArray(record.controls) ? record.controls.length : 0,
    status: record.status,
});

export const mapComplianceDashboardSummary = (record: DbAcComplianceDashboard, maps: LookupMaps): ComplianceDashboardSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    dashboardKey: record.dashboard_key,
    name: record.name,
    framework: record.framework,
    compliancePercent: record.compliance_percent,
    requirementCount: Array.isArray(record.requirements) ? record.requirements.length : 0,
    status: record.status,
});

export const mapOperationalHealthSummary = (record: DbAcOperationalHealth, maps: LookupMaps): OperationalHealthSummary => ({
    id: record.id,
    contextTitle: contextTitle(maps, record.context_id) ?? "",
    healthKey: record.health_key,
    name: record.name,
    overallScore: record.overall_score,
    dimensionCount: Array.isArray(record.dimension_scores) ? record.dimension_scores.length : 0,
    status: record.status,
});

export const mapAuditEntry = (record: DbAcAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id,
    action: record.action,
    summary: record.summary,
    securityLevel: record.security_level,
    createdAt: record.created_at,
});

export const buildAcDashboardStats = (input: {
    contexts: CompanyContextSummary[];
    workflowOrchestrations: WorkflowOrchestrationSummary[];
    eventBusEvents: EventBusSummary[];
    workerCollaborations: WorkerCollaborationSummary[];
    approvalWorkflows: ApprovalWorkflowSummary[];
    notifications: NotificationSummary[];
    timelines: TimelineSummary[];
    activityFeeds: ActivityFeedSummary[];
    automations: AutomationSummary[];
    executiveInsights: ExecutiveInsightSummary[];
    predictiveRecommendations: PredictiveRecommendationSummary[];
    systemSearches: SystemSearchSummary[];
    commandPalette: CommandPaletteSummary[];
    emergencyWorkflows: EmergencyWorkflowSummary[];
    businessKpis: BusinessKpiSummary[];
    securityGovernance: SecurityGovernanceSummary[];
    complianceDashboards: ComplianceDashboardSummary[];
    operationalHealth: OperationalHealthSummary[];
}): AcDashboardStats => ({
    totalContexts: input.contexts.length,
    activeContexts: input.contexts.filter((c) => c.status === "active").length,
    workflowOrchestrationCount: input.workflowOrchestrations.length,
    eventBusCount: input.eventBusEvents.length,
    workerCollaborationCount: input.workerCollaborations.length,
    approvalWorkflowCount: input.approvalWorkflows.length,
    notificationCount: input.notifications.length,
    timelineCount: input.timelines.length,
    activityFeedCount: input.activityFeeds.length,
    automationCount: input.automations.length,
    executiveInsightCount: input.executiveInsights.length,
    predictionCount: input.predictiveRecommendations.length,
    searchIndexCount: input.systemSearches.length,
    commandCount: input.commandPalette.length,
    emergencyWorkflowCount: input.emergencyWorkflows.length,
    kpiCount: input.businessKpis.length,
    securityGovernanceCount: input.securityGovernance.length,
    complianceDashboardCount: input.complianceDashboards.length,
    operationalHealthCount: input.operationalHealth.length,
    avgOperationalScore: input.operationalHealth.length
        ? input.operationalHealth.reduce((s, h) => s + h.overallScore, 0) / input.operationalHealth.length
        : 0,
    avgCompliancePercent: input.complianceDashboards.length
        ? input.complianceDashboards.reduce((s, d) => s + d.compliancePercent, 0) / input.complianceDashboards.length
        : 0,
});

export const buildAcPipelineInfo = (): AcPipelineInfo => ({
    stages: [
        { key: "customer_requirement", label: "Customer Requirement" },
        { key: "business_analyst", label: "AI Business Analyst" },
        { key: "architecture_design", label: "AI Solution Architect" },
        { key: "development_factory", label: "AI Development Factory" },
        { key: "qa_engineering", label: "AI QA Engineering" },
        { key: "devops_deployment", label: "AI DevOps & Deployment" },
        { key: "customer_success", label: "AI Customer Success Manager" },
        { key: "founder_operating_system", label: "Founder Operating System" },
        { key: "autonomous_company", label: "Autonomous Company v1" },
        { key: "continuous_operations", label: "Continuous Operations" },
    ],
    currentWorker: "Autonomous Company v1",
    nextWorker: "Continuous Operations",
    previousWorker: "Founder Operating System",
});

export const buildCompanyContextPayload = (organizationId: string, input: CreateCompanyContextInput) => ({
    organization_id: organizationId,
    title: input.title,
    context_key: input.contextKey,
    ba_engagement_id: input.baEngagementId || null,
    sa_engagement_id: input.saEngagementId || null,
    df_engagement_id: input.dfEngagementId || null,
    qa_engagement_id: input.qaEngagementId || null,
    dd_engagement_id: input.ddEngagementId || null,
    cs_engagement_id: input.csEngagementId || null,
    fo_workspace_id: input.foWorkspaceId || null,
    client_id: input.clientId || null,
    project_id: input.projectId || null,
    agent_id: input.agentId || null,
    session_id: input.sessionId || null,
    knowledge_context_id: input.knowledgeContextId || null,
    pipeline_stage: input.pipelineStage ?? "autonomous_company",
    summary: input.summary ?? "",
});

export const buildWorkflowOrchestrationPayload = (organizationId: string, input: CreateWorkflowOrchestrationInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    orchestration_key: input.orchestrationKey,
    name: input.name,
    workflow_definition: input.workflowDefinition ?? [],
    participating_modules: input.participatingModules ?? [],
});

export const buildEventBusPayload = (organizationId: string, input: CreateEventBusInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    event_key: input.eventKey,
    name: input.name,
    source_module: input.sourceModule ?? "",
    target_modules: input.targetModules ?? [],
});

export const buildWorkerCollaborationPayload = (organizationId: string, input: CreateWorkerCollaborationInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    collaboration_key: input.collaborationKey,
    name: input.name,
    participating_workers: input.participatingWorkers ?? [],
    handoff_rules: input.handoffRules ?? [],
});

export const buildApprovalWorkflowPayload = (organizationId: string, input: CreateApprovalWorkflowInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    workflow_key: input.workflowKey,
    title: input.title,
    approval_steps: input.approvalSteps ?? [],
    required_role: input.requiredRole ?? "",
});

export const buildNotificationPayload = (organizationId: string, input: CreateNotificationInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    notification_key: input.notificationKey,
    title: input.title,
    channel: input.channel ?? "in_app",
    priority: input.priority ?? "normal",
    message: input.message ?? "",
});

export const buildTimelinePayload = (organizationId: string, input: CreateTimelineInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    timeline_key: input.timelineKey,
    title: input.title,
    event_type: input.eventType ?? "",
    event_at: input.eventAt ?? new Date().toISOString(),
});

export const buildActivityFeedPayload = (organizationId: string, input: CreateActivityFeedInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    feed_key: input.feedKey,
    actor_type: input.actorType ?? "user",
    actor_name: input.actorName ?? "",
    action: input.action ?? "",
    resource_type: input.resourceType ?? "",
    summary: input.summary ?? "",
});

export const buildAutomationPayload = (organizationId: string, input: CreateAutomationInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    automation_key: input.automationKey,
    name: input.name,
    trigger_module: input.triggerModule ?? "",
    action_modules: input.actionModules ?? [],
});

export const buildExecutiveInsightPayload = (organizationId: string, input: CreateExecutiveInsightInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    insight_key: input.insightKey,
    title: input.title,
    insight_type: input.insightType ?? "summary",
    content: input.content ?? "",
    metrics: input.metrics ?? [],
});

export const buildPredictiveRecommendationPayload = (organizationId: string, input: CreatePredictiveRecommendationInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    recommendation_key: input.recommendationKey,
    title: input.title,
    recommendation_type: input.recommendationType ?? "operational",
    confidence_score: input.confidenceScore ?? 0,
    recommendation: input.recommendation ?? "",
});

export const buildSystemSearchPayload = (organizationId: string, input: CreateSystemSearchInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    search_key: input.searchKey,
    resource_type: input.resourceType,
    title: input.title,
    keywords: input.keywords ?? "",
    module_source: input.moduleSource ?? "",
});

export const buildCommandPalettePayload = (organizationId: string, input: CreateCommandPaletteInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    command_key: input.commandKey,
    label: input.label,
    action_type: input.actionType ?? "navigate",
    target_path: input.targetPath ?? "",
    shortcut: input.shortcut ?? "",
});

export const buildEmergencyWorkflowPayload = (organizationId: string, input: CreateEmergencyWorkflowInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    workflow_key: input.workflowKey,
    name: input.name,
    severity: input.severity ?? "medium",
    response_steps: input.responseSteps ?? [],
});

export const buildBusinessKpiPayload = (organizationId: string, input: CreateBusinessKpiInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    kpi_key: input.kpiKey,
    name: input.name,
    kpi_category: input.kpiCategory ?? "operational",
    current_value: input.currentValue ?? 0,
    target_value: input.targetValue ?? 0,
    unit: input.unit ?? "",
});

export const buildSecurityGovernancePayload = (organizationId: string, input: CreateSecurityGovernanceInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    governance_key: input.governanceKey,
    name: input.name,
    control_area: input.controlArea ?? "access",
    controls: input.controls ?? [],
    compliance_status: input.complianceStatus ?? "pending",
});

export const buildComplianceDashboardPayload = (organizationId: string, input: CreateComplianceDashboardInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    dashboard_key: input.dashboardKey,
    name: input.name,
    framework: input.framework ?? "soc2",
    requirements: input.requirements ?? [],
    compliance_percent: input.compliancePercent ?? 0,
});

export const buildOperationalHealthPayload = (organizationId: string, input: CreateOperationalHealthInput) => ({
    organization_id: organizationId,
    context_id: input.contextId,
    health_key: input.healthKey,
    name: input.name,
    overall_score: input.overallScore ?? 0,
    dimension_scores: input.dimensionScores ?? [],
});

export const buildAcAuditPayload = (
    organizationId: string,
    entityType: string,
    action: string,
    summary: string,
    entityId?: string,
    securityLevel: string = "standard",
) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
    security_level: securityLevel,
});
