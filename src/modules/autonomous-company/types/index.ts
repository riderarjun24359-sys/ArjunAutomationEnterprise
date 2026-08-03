export type AutonomousCompanyTab =
    | "overview"
    | "companyContexts"
    | "workflowOrchestration"
    | "eventBus"
    | "workerCollaboration"
    | "approvals"
    | "notifications"
    | "timeline"
    | "activityFeed"
    | "automations"
    | "executiveInsights"
    | "predictions"
    | "search"
    | "commandPalette"
    | "emergency"
    | "kpis"
    | "security"
    | "compliance"
    | "health"
    | "audit"
    | "api";

export interface AcDashboardStats {
    totalContexts: number;
    activeContexts: number;
    workflowOrchestrationCount: number;
    eventBusCount: number;
    workerCollaborationCount: number;
    approvalWorkflowCount: number;
    notificationCount: number;
    timelineCount: number;
    activityFeedCount: number;
    automationCount: number;
    executiveInsightCount: number;
    predictionCount: number;
    searchIndexCount: number;
    commandCount: number;
    emergencyWorkflowCount: number;
    kpiCount: number;
    securityGovernanceCount: number;
    complianceDashboardCount: number;
    operationalHealthCount: number;
    avgOperationalScore: number;
    avgCompliancePercent: number;
}

export interface AcPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentWorker: string;
    nextWorker: string;
    previousWorker: string;
}

export interface CompanyContextSummary {
    id: string;
    title: string;
    contextKey: string;
    baEngagementTitle?: string | null;
    saEngagementTitle?: string | null;
    dfEngagementTitle?: string | null;
    qaEngagementTitle?: string | null;
    ddEngagementTitle?: string | null;
    csEngagementTitle?: string | null;
    foWorkspaceTitle?: string | null;
    clientName?: string | null;
    projectName?: string | null;
    agentName?: string | null;
    pipelineStage: string;
    status: string;
    summaryPreview: string;
    updatedAt: string;
}

export interface WorkflowOrchestrationSummary {
    id: string;
    contextTitle: string;
    orchestrationKey: string;
    name: string;
    moduleCount: number;
    stepCount: number;
    status: string;
}

export interface EventBusSummary {
    id: string;
    contextTitle: string;
    eventKey: string;
    name: string;
    sourceModule: string;
    targetCount: number;
    status: string;
}

export interface WorkerCollaborationSummary {
    id: string;
    contextTitle: string;
    collaborationKey: string;
    name: string;
    workerCount: number;
    handoffCount: number;
    status: string;
}

export interface ApprovalWorkflowSummary {
    id: string;
    contextTitle: string;
    workflowKey: string;
    title: string;
    requiredRole: string;
    stepCount: number;
    status: string;
}

export interface NotificationSummary {
    id: string;
    contextTitle: string;
    notificationKey: string;
    title: string;
    channel: string;
    priority: string;
    status: string;
}

export interface TimelineSummary {
    id: string;
    contextTitle: string;
    timelineKey: string;
    title: string;
    eventType: string;
    eventAt: string;
    status: string;
}

export interface ActivityFeedSummary {
    id: string;
    contextTitle: string;
    feedKey: string;
    actorName: string;
    action: string;
    resourceType: string;
    summary: string;
    createdAt: string;
}

export interface AutomationSummary {
    id: string;
    contextTitle: string;
    automationKey: string;
    name: string;
    triggerModule: string;
    actionCount: number;
    status: string;
}

export interface ExecutiveInsightSummary {
    id: string;
    contextTitle: string;
    insightKey: string;
    title: string;
    insightType: string;
    contentPreview: string;
    metricCount: number;
    status: string;
}

export interface PredictiveRecommendationSummary {
    id: string;
    contextTitle: string;
    recommendationKey: string;
    title: string;
    recommendationType: string;
    confidenceScore: number;
    status: string;
}

export interface SystemSearchSummary {
    id: string;
    contextTitle: string;
    searchKey: string;
    title: string;
    resourceType: string;
    moduleSource: string;
    status: string;
}

export interface CommandPaletteSummary {
    id: string;
    contextTitle: string;
    commandKey: string;
    label: string;
    actionType: string;
    targetPath: string;
    shortcut: string;
    status: string;
}

export interface EmergencyWorkflowSummary {
    id: string;
    contextTitle: string;
    workflowKey: string;
    name: string;
    severity: string;
    stepCount: number;
    status: string;
}

export interface BusinessKpiSummary {
    id: string;
    contextTitle: string;
    kpiKey: string;
    name: string;
    kpiCategory: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    status: string;
}

export interface SecurityGovernanceSummary {
    id: string;
    contextTitle: string;
    governanceKey: string;
    name: string;
    controlArea: string;
    complianceStatus: string;
    controlCount: number;
    status: string;
}

export interface ComplianceDashboardSummary {
    id: string;
    contextTitle: string;
    dashboardKey: string;
    name: string;
    framework: string;
    compliancePercent: number;
    requirementCount: number;
    status: string;
}

export interface OperationalHealthSummary {
    id: string;
    contextTitle: string;
    healthKey: string;
    name: string;
    overallScore: number;
    dimensionCount: number;
    status: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface CreateCompanyContextInput {
    title: string;
    contextKey: string;
    baEngagementId?: string;
    saEngagementId?: string;
    dfEngagementId?: string;
    qaEngagementId?: string;
    ddEngagementId?: string;
    csEngagementId?: string;
    foWorkspaceId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
    knowledgeContextId?: string;
    pipelineStage?: string;
    summary?: string;
}

export interface CreateWorkflowOrchestrationInput {
    contextId: string;
    orchestrationKey: string;
    name: string;
    workflowDefinition?: unknown[];
    participatingModules?: unknown[];
}

export interface CreateEventBusInput {
    contextId: string;
    eventKey: string;
    name: string;
    sourceModule?: string;
    targetModules?: unknown[];
}

export interface CreateWorkerCollaborationInput {
    contextId: string;
    collaborationKey: string;
    name: string;
    participatingWorkers?: unknown[];
    handoffRules?: unknown[];
}

export interface CreateApprovalWorkflowInput {
    contextId: string;
    workflowKey: string;
    title: string;
    approvalSteps?: unknown[];
    requiredRole?: string;
}

export interface CreateNotificationInput {
    contextId: string;
    notificationKey: string;
    title: string;
    channel?: string;
    priority?: string;
    message?: string;
}

export interface CreateTimelineInput {
    contextId: string;
    timelineKey: string;
    title: string;
    eventType?: string;
    eventAt?: string;
}

export interface CreateActivityFeedInput {
    contextId: string;
    feedKey: string;
    actorType?: string;
    actorName?: string;
    action?: string;
    resourceType?: string;
    summary?: string;
}

export interface CreateAutomationInput {
    contextId: string;
    automationKey: string;
    name: string;
    triggerModule?: string;
    actionModules?: unknown[];
}

export interface CreateExecutiveInsightInput {
    contextId: string;
    insightKey: string;
    title: string;
    insightType?: string;
    content?: string;
    metrics?: unknown[];
}

export interface CreatePredictiveRecommendationInput {
    contextId: string;
    recommendationKey: string;
    title: string;
    recommendationType?: string;
    confidenceScore?: number;
    recommendation?: string;
}

export interface CreateSystemSearchInput {
    contextId: string;
    searchKey: string;
    resourceType: string;
    title: string;
    keywords?: string;
    moduleSource?: string;
}

export interface CreateCommandPaletteInput {
    contextId: string;
    commandKey: string;
    label: string;
    actionType?: string;
    targetPath?: string;
    shortcut?: string;
}

export interface CreateEmergencyWorkflowInput {
    contextId: string;
    workflowKey: string;
    name: string;
    severity?: string;
    responseSteps?: unknown[];
}

export interface CreateBusinessKpiInput {
    contextId: string;
    kpiKey: string;
    name: string;
    kpiCategory?: string;
    currentValue?: number;
    targetValue?: number;
    unit?: string;
}

export interface CreateSecurityGovernanceInput {
    contextId: string;
    governanceKey: string;
    name: string;
    controlArea?: string;
    controls?: unknown[];
    complianceStatus?: string;
}

export interface CreateComplianceDashboardInput {
    contextId: string;
    dashboardKey: string;
    name: string;
    framework?: string;
    requirements?: unknown[];
    compliancePercent?: number;
}

export interface CreateOperationalHealthInput {
    contextId: string;
    healthKey: string;
    name: string;
    overallScore?: number;
    dimensionScores?: unknown[];
}

export interface AcSdkStartContextInput {
    title: string;
    contextKey: string;
    foWorkspaceId?: string;
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

export interface AcSdkStartContextResult {
    contextId: string;
    contextKey: string;
    pipelineStage: string;
    aiTaskId?: string | null;
}

export interface AcSdkOrchestrateWorkflowInput {
    contextId: string;
    orchestrationKey: string;
    name: string;
    participatingModules?: unknown[];
}

export interface AcSdkOrchestrateWorkflowResult {
    orchestrationId: string;
    orchestrationKey: string;
    status: string;
}

export interface AcSdkRunCollaborationInput {
    contextId: string;
    collaborationKey: string;
    name: string;
    participatingWorkers?: unknown[];
}

export interface AcSdkRunCollaborationResult {
    collaborationId: string;
    collaborationKey: string;
    status: string;
}
