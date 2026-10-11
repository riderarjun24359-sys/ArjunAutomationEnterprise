export interface CsdDashboardStats {
    totalDeliveryHubs: number;
    activeDeliveryHubs: number;
    customerHealthScoreCount: number;
    supportTicketCount: number;
    deploymentTrackingCount: number;
    trainingPortalCount: number;
    openDeliveryFailureCount: number;
    overallDeliveryScore: number;
    customerHealthScore: number;
    openTicketCount: number;
    slaComplianceScore: number;
    deploymentStatusScore: number;
    renewalForecastCount: number;
    adoptionRate: number;
    auditCount: number;
}

export interface CsdPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
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

export interface CsdSdkTrackCustomerHealthInput { deliveryHubId: string; scoreKey?: string; customerRef?: string; }
export interface CsdSdkTrackCustomerHealthResult { scoreId: string; scoreKey: string; status: string; }
export interface CsdSdkOpenSupportTicketInput { deliveryHubId: string; ticketKey?: string; ticketTitle?: string; }
export interface CsdSdkOpenSupportTicketResult { ticketId: string; ticketKey: string; status: string; }
export interface CsdSdkRunDeliveryWorkflowInput { deliveryHubId: string; workflowKey?: string; workflowName?: string; }
export interface CsdSdkRunDeliveryWorkflowResult { workflowId: string; workflowKey: string; status: string; }

export interface DeliveryHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateDeliveryHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface CustomerHealthScoreSummary {
    id: string;
    hubName?: string;
        scoreKey: string;
    customerRef: string;
    healthScore: number;
    status: string;
}

export interface CreateCustomerHealthScoreInput {
        deliveryHubId: string;
        scoreKey?: string;
    customerRef?: string;
    healthScore?: number;
}

export interface AdoptionAnalyticSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    featureName: string;
    adoptionRate: number;
    status: string;
}

export interface CreateAdoptionAnalyticInput {
        deliveryHubId: string;
        analyticsKey?: string;
    featureName?: string;
    adoptionRate?: number;
}

export interface SuccessPlanSummary {
    id: string;
    hubName?: string;
        planKey: string;
    planName: string;
    planStatus: string;
    status: string;
}

export interface CreateSuccessPlanInput {
        deliveryHubId: string;
        planKey?: string;
    planName?: string;
    planStatus?: string;
}

export interface CustomerTimelineSummary {
    id: string;
    hubName?: string;
        timelineKey: string;
    timelineName: string;
    timelineType: string;
    status: string;
}

export interface CreateCustomerTimelineInput {
        deliveryHubId: string;
        timelineKey?: string;
    timelineName?: string;
    timelineType?: string;
}

export interface RenewalForecastSummary {
    id: string;
    hubName?: string;
        forecastKey: string;
    customerRef: string;
    forecastStatus: string;
    status: string;
    renewalDate: string | null;
    forecastValue: number;
}

export interface CreateRenewalForecastInput {
        deliveryHubId: string;
        forecastKey?: string;
    customerRef?: string;
    forecastStatus?: string;
}

export interface SupportTicketSummary {
    id: string;
    hubName?: string;
        ticketKey: string;
    ticketTitle: string;
    ticketStatus: string;
    status: string;
}

export interface CreateSupportTicketInput {
        deliveryHubId: string;
        ticketKey?: string;
    ticketTitle?: string;
    ticketStatus?: string;
}

export interface LiveChatSessionSummary {
    id: string;
    hubName?: string;
        sessionKey: string;
    sessionTitle: string;
    sessionStatus: string;
    status: string;
}

export interface CreateLiveChatSessionInput {
        deliveryHubId: string;
        sessionKey?: string;
    sessionTitle?: string;
    sessionStatus?: string;
}

export interface KnowledgeBaseArticleSummary {
    id: string;
    hubName?: string;
        articleKey: string;
    articleTitle: string;
    articleCategory: string;
    status: string;
}

export interface CreateKnowledgeBaseArticleInput {
        deliveryHubId: string;
        articleKey?: string;
    articleTitle?: string;
    articleCategory?: string;
}

export interface SlaPolicySummary {
    id: string;
    hubName?: string;
        policyKey: string;
    policyName: string;
    policyType: string;
    status: string;
}

export interface CreateSlaPolicyInput {
        deliveryHubId: string;
        policyKey?: string;
    policyName?: string;
    policyType?: string;
}

export interface EscalationRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    ruleType: string;
    status: string;
}

export interface CreateEscalationRuleInput {
        deliveryHubId: string;
        ruleKey?: string;
    ruleName?: string;
    ruleType?: string;
}

export interface DeploymentAutomationSummary {
    id: string;
    hubName?: string;
        automationKey: string;
    automationName: string;
    automationStatus: string;
    status: string;
}

export interface CreateDeploymentAutomationInput {
        deliveryHubId: string;
        automationKey?: string;
    automationName?: string;
    automationStatus?: string;
}

export interface EnvironmentManagementSummary {
    id: string;
    hubName?: string;
        environmentKey: string;
    environmentName: string;
    environmentType: string;
    status: string;
}

export interface CreateEnvironmentManagementInput {
        deliveryHubId: string;
        environmentKey?: string;
    environmentName?: string;
    environmentType?: string;
}

export interface DeploymentTrackingSummary {
    id: string;
    hubName?: string;
        trackingKey: string;
    deploymentName: string;
    deploymentStatus: string;
    status: string;
}

export interface CreateDeploymentTrackingInput {
        deliveryHubId: string;
        trackingKey?: string;
    deploymentName?: string;
    deploymentStatus?: string;
}

export interface UpgradeManagementSummary {
    id: string;
    hubName?: string;
        upgradeKey: string;
    upgradeName: string;
    upgradeStatus: string;
    status: string;
}

export interface CreateUpgradeManagementInput {
        deliveryHubId: string;
        upgradeKey?: string;
    upgradeName?: string;
    upgradeStatus?: string;
}

export interface ReleaseTrackingSummary {
    id: string;
    hubName?: string;
        releaseKey: string;
    releaseName: string;
    releaseStatus: string;
    status: string;
}

export interface CreateReleaseTrackingInput {
        deliveryHubId: string;
        releaseKey?: string;
    releaseName?: string;
    releaseStatus?: string;
}

export interface TrainingPortalSummary {
    id: string;
    hubName?: string;
        portalKey: string;
    portalName: string;
    portalType: string;
    status: string;
}

export interface CreateTrainingPortalInput {
        deliveryHubId: string;
        portalKey?: string;
    portalName?: string;
    portalType?: string;
}

export interface VideoLibrarySummary {
    id: string;
    hubName?: string;
        videoKey: string;
    videoTitle: string;
    videoCategory: string;
    status: string;
}

export interface CreateVideoLibraryInput {
        deliveryHubId: string;
        videoKey?: string;
    videoTitle?: string;
    videoCategory?: string;
}

export interface ProductTourSummary {
    id: string;
    hubName?: string;
        tourKey: string;
    tourName: string;
    tourType: string;
    status: string;
}

export interface CreateProductTourInput {
        deliveryHubId: string;
        tourKey?: string;
    tourName?: string;
    tourType?: string;
}

export interface CertificationSummary {
    id: string;
    hubName?: string;
        certificationKey: string;
    certificationName: string;
    certificationType: string;
    status: string;
}

export interface CreateCertificationInput {
        deliveryHubId: string;
        certificationKey?: string;
    certificationName?: string;
    certificationType?: string;
}

export interface ProgressTrackingSummary {
    id: string;
    hubName?: string;
        progressKey: string;
    learnerRef: string;
    progressPercent: number;
    status: string;
}

export interface CreateProgressTrackingInput {
        deliveryHubId: string;
        progressKey?: string;
    learnerRef?: string;
    progressPercent?: number;
}

export interface LearningAnalyticSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    metricName: string;
    completionRate: number;
    status: string;
}

export interface CreateLearningAnalyticInput {
        deliveryHubId: string;
        analyticsKey?: string;
    metricName?: string;
    completionRate?: number;
}

export interface DeliveryWorkflowSummary {
    id: string;
    hubName?: string;
        workflowKey: string;
    workflowName: string;
    workflowStatus: string;
    status: string;
}

export interface CreateDeliveryWorkflowInput {
        deliveryHubId: string;
        workflowKey?: string;
    workflowName?: string;
    workflowStatus?: string;
}

export interface OnboardingAutomationSummary {
    id: string;
    hubName?: string;
        automationKey: string;
    automationName: string;
    automationStatus: string;
    status: string;
}

export interface CreateOnboardingAutomationInput {
        deliveryHubId: string;
        automationKey?: string;
    automationName?: string;
    automationStatus?: string;
}

export interface ImplementationTrackingSummary {
    id: string;
    hubName?: string;
        trackingKey: string;
    implementationName: string;
    implementationStatus: string;
    status: string;
}

export interface CreateImplementationTrackingInput {
        deliveryHubId: string;
        trackingKey?: string;
    implementationName?: string;
    implementationStatus?: string;
}

export interface ResourceAssignmentSummary {
    id: string;
    hubName?: string;
        assignmentKey: string;
    resourceName: string;
    resourceType: string;
    status: string;
}

export interface CreateResourceAssignmentInput {
        deliveryHubId: string;
        assignmentKey?: string;
    resourceName?: string;
    resourceType?: string;
}

export interface MilestoneTrackingSummary {
    id: string;
    hubName?: string;
        milestoneKey: string;
    milestoneName: string;
    milestoneStatus: string;
    status: string;
}

export interface CreateMilestoneTrackingInput {
        deliveryHubId: string;
        milestoneKey?: string;
    milestoneName?: string;
    milestoneStatus?: string;
}

export interface OperationsMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    customerHealthScore: number;
    overallDeliveryScore: number;
    status: string;
}

export interface CreateOperationsMetricInput {
        metricsKey?: string;
    customerHealthScore?: number;
    overallDeliveryScore?: number;
}

export interface OperationsHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateOperationsHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface ExecutiveKpiSummary {
    id: string;
    hubName?: string;
        kpiKey: string;
    kpiName: string;
    kpiScore: number;
    status: string;
}

export interface CreateExecutiveKpiInput {
        deliveryHubId: string;
        kpiKey?: string;
    kpiName?: string;
    kpiScore?: number;
}

export interface DeliveryFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateDeliveryFailureInput {
        deliveryHubId: string;
        failureKey?: string;
    failureType?: string;
}

