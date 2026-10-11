import type { DbCsdDeliveryHub,
    DbCsdCustomerHealthScore,
    DbCsdAdoptionAnalytic,
    DbCsdSuccessPlan,
    DbCsdCustomerTimeline,
    DbCsdRenewalForecast,
    DbCsdSupportTicket,
    DbCsdLiveChatSession,
    DbCsdKnowledgeBaseArticle,
    DbCsdSlaPolicy,
    DbCsdEscalationRule,
    DbCsdDeploymentAutomation,
    DbCsdEnvironmentManagement,
    DbCsdDeploymentTracking,
    DbCsdUpgradeManagement,
    DbCsdReleaseTracking,
    DbCsdTrainingPortal,
    DbCsdVideoLibrary,
    DbCsdProductTour,
    DbCsdCertification,
    DbCsdProgressTracking,
    DbCsdLearningAnalytic,
    DbCsdDeliveryWorkflow,
    DbCsdOnboardingAutomation,
    DbCsdImplementationTracking,
    DbCsdResourceAssignment,
    DbCsdMilestoneTracking,
    DbCsdOperationsMetric,
    DbCsdOperationsHealth,
    DbCsdExecutiveKpi,
    DbCsdDeliveryFailure,
    DbCsdAuditLog } from "@/src/modules/database/types/platform";
import type { CreateDeliveryHubInput,
    DeliveryHubSummary,
    CreateCustomerHealthScoreInput,
    CustomerHealthScoreSummary,
    CreateAdoptionAnalyticInput,
    AdoptionAnalyticSummary,
    CreateSuccessPlanInput,
    SuccessPlanSummary,
    CreateCustomerTimelineInput,
    CustomerTimelineSummary,
    CreateRenewalForecastInput,
    RenewalForecastSummary,
    CreateSupportTicketInput,
    SupportTicketSummary,
    CreateLiveChatSessionInput,
    LiveChatSessionSummary,
    CreateKnowledgeBaseArticleInput,
    KnowledgeBaseArticleSummary,
    CreateSlaPolicyInput,
    SlaPolicySummary,
    CreateEscalationRuleInput,
    EscalationRuleSummary,
    CreateDeploymentAutomationInput,
    DeploymentAutomationSummary,
    CreateEnvironmentManagementInput,
    EnvironmentManagementSummary,
    CreateDeploymentTrackingInput,
    DeploymentTrackingSummary,
    CreateUpgradeManagementInput,
    UpgradeManagementSummary,
    CreateReleaseTrackingInput,
    ReleaseTrackingSummary,
    CreateTrainingPortalInput,
    TrainingPortalSummary,
    CreateVideoLibraryInput,
    VideoLibrarySummary,
    CreateProductTourInput,
    ProductTourSummary,
    CreateCertificationInput,
    CertificationSummary,
    CreateProgressTrackingInput,
    ProgressTrackingSummary,
    CreateLearningAnalyticInput,
    LearningAnalyticSummary,
    CreateDeliveryWorkflowInput,
    DeliveryWorkflowSummary,
    CreateOnboardingAutomationInput,
    OnboardingAutomationSummary,
    CreateImplementationTrackingInput,
    ImplementationTrackingSummary,
    CreateResourceAssignmentInput,
    ResourceAssignmentSummary,
    CreateMilestoneTrackingInput,
    MilestoneTrackingSummary,
    CreateOperationsMetricInput,
    OperationsMetricSummary,
    CreateOperationsHealthInput,
    OperationsHealthSummary,
    CreateExecutiveKpiInput,
    ExecutiveKpiSummary,
    CreateDeliveryFailureInput,
    DeliveryFailureSummary,
    CsdDashboardStats,
    CsdPipelineInfo,
    AuditEntry } from "@/src/modules/customer-success-delivery/types";

export function buildDeliveryHubLookupMaps(hubs: DbCsdDeliveryHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildCsdPipelineInfo(): CsdPipelineInfo {
    const stages = [
        { key: "customer_success", label: "Customer Success" },
        { key: "support", label: "Support" },
        { key: "deployment", label: "Deployment" },
        { key: "learning", label: "Learning" },
        { key: "ado_foundation", label: "ADO Foundation" },
        { key: "dashboard", label: "Dashboard" },
    ];
    return { stages, currentStage: "deployment", nextStage: "learning", previousStage: "support" };
}

export function buildCsdAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbCsdAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapDeliveryHubSummary(record: DbCsdDeliveryHub): DeliveryHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildDeliveryHubPayload(organizationId: string, input: CreateDeliveryHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapCustomerHealthScoreSummary(record: DbCsdCustomerHealthScore, maps?: { hubNameById: Map<string, string> }): CustomerHealthScoreSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        scoreKey: record.score_key as string,
        customerRef: record.customer_ref as string,
        healthScore: record.health_score as number,
        status: record.status,
    };
}

export function buildCustomerHealthScorePayload(organizationId: string, input: CreateCustomerHealthScoreInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        score_key: input.scoreKey ?? '',
        customer_ref: input.customerRef ?? '',
        health_score: input.healthScore ?? 0,
        status: "active",
    };
}

export function mapAdoptionAnalyticSummary(record: DbCsdAdoptionAnalytic, maps?: { hubNameById: Map<string, string> }): AdoptionAnalyticSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        featureName: record.feature_name as string,
        adoptionRate: record.adoption_rate as number,
        status: record.status,
    };
}

export function buildAdoptionAnalyticPayload(organizationId: string, input: CreateAdoptionAnalyticInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        analytics_key: input.analyticsKey ?? '',
        feature_name: input.featureName ?? '',
        adoption_rate: input.adoptionRate ?? 0,
        status: "active",
    };
}

export function mapSuccessPlanSummary(record: DbCsdSuccessPlan, maps?: { hubNameById: Map<string, string> }): SuccessPlanSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        planKey: record.plan_key as string,
        planName: record.plan_name as string,
        planStatus: record.plan_status as string,
        status: record.status,
    };
}

export function buildSuccessPlanPayload(organizationId: string, input: CreateSuccessPlanInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        plan_key: input.planKey ?? '',
        plan_name: input.planName ?? '',
        plan_status: input.planStatus ?? '',
        status: "active",
    };
}

export function mapCustomerTimelineSummary(record: DbCsdCustomerTimeline, maps?: { hubNameById: Map<string, string> }): CustomerTimelineSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        timelineKey: record.timeline_key as string,
        timelineName: record.timeline_name as string,
        timelineType: record.timeline_type as string,
        status: record.status,
    };
}

export function buildCustomerTimelinePayload(organizationId: string, input: CreateCustomerTimelineInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        timeline_key: input.timelineKey ?? '',
        timeline_name: input.timelineName ?? '',
        timeline_type: input.timelineType ?? '',
        status: "active",
    };
}

export function mapRenewalForecastSummary(record: DbCsdRenewalForecast, maps?: { hubNameById: Map<string, string> }): RenewalForecastSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        forecastKey: record.forecast_key as string,
        customerRef: record.customer_ref as string,
        forecastStatus: record.forecast_status as string,
        status: record.status,
        renewalDate: (record.renewal_date as string | null) ?? null,
        forecastValue: Number(record.forecast_value ?? 0),
    };
}

export function buildRenewalForecastPayload(organizationId: string, input: CreateRenewalForecastInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        forecast_key: input.forecastKey ?? '',
        customer_ref: input.customerRef ?? '',
        forecast_status: input.forecastStatus ?? '',
        status: "active",
    };
}

export function mapSupportTicketSummary(record: DbCsdSupportTicket, maps?: { hubNameById: Map<string, string> }): SupportTicketSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ticketKey: record.ticket_key as string,
        ticketTitle: record.ticket_title as string,
        ticketStatus: record.ticket_status as string,
        status: record.status,
    };
}

export function buildSupportTicketPayload(organizationId: string, input: CreateSupportTicketInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        ticket_key: input.ticketKey ?? '',
        ticket_title: input.ticketTitle ?? '',
        ticket_status: input.ticketStatus ?? '',
        status: "active",
    };
}

export function mapLiveChatSessionSummary(record: DbCsdLiveChatSession, maps?: { hubNameById: Map<string, string> }): LiveChatSessionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        sessionKey: record.session_key as string,
        sessionTitle: record.session_title as string,
        sessionStatus: record.session_status as string,
        status: record.status,
    };
}

export function buildLiveChatSessionPayload(organizationId: string, input: CreateLiveChatSessionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        session_key: input.sessionKey ?? '',
        session_title: input.sessionTitle ?? '',
        session_status: input.sessionStatus ?? '',
        status: "active",
    };
}

export function mapKnowledgeBaseArticleSummary(record: DbCsdKnowledgeBaseArticle, maps?: { hubNameById: Map<string, string> }): KnowledgeBaseArticleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        articleKey: record.article_key as string,
        articleTitle: record.article_title as string,
        articleCategory: record.article_category as string,
        status: record.status,
    };
}

export function buildKnowledgeBaseArticlePayload(organizationId: string, input: CreateKnowledgeBaseArticleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        article_key: input.articleKey ?? '',
        article_title: input.articleTitle ?? '',
        article_category: input.articleCategory ?? '',
        status: "active",
    };
}

export function mapSlaPolicySummary(record: DbCsdSlaPolicy, maps?: { hubNameById: Map<string, string> }): SlaPolicySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        policyKey: record.policy_key as string,
        policyName: record.policy_name as string,
        policyType: record.policy_type as string,
        status: record.status,
    };
}

export function buildSlaPolicyPayload(organizationId: string, input: CreateSlaPolicyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        policy_key: input.policyKey ?? '',
        policy_name: input.policyName ?? '',
        policy_type: input.policyType ?? '',
        status: "active",
    };
}

export function mapEscalationRuleSummary(record: DbCsdEscalationRule, maps?: { hubNameById: Map<string, string> }): EscalationRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        ruleType: record.rule_type as string,
        status: record.status,
    };
}

export function buildEscalationRulePayload(organizationId: string, input: CreateEscalationRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        rule_type: input.ruleType ?? '',
        status: "active",
    };
}

export function mapDeploymentAutomationSummary(record: DbCsdDeploymentAutomation, maps?: { hubNameById: Map<string, string> }): DeploymentAutomationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        automationKey: record.automation_key as string,
        automationName: record.automation_name as string,
        automationStatus: record.automation_status as string,
        status: record.status,
    };
}

export function buildDeploymentAutomationPayload(organizationId: string, input: CreateDeploymentAutomationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        automation_key: input.automationKey ?? '',
        automation_name: input.automationName ?? '',
        automation_status: input.automationStatus ?? '',
        status: "active",
    };
}

export function mapEnvironmentManagementSummary(record: DbCsdEnvironmentManagement, maps?: { hubNameById: Map<string, string> }): EnvironmentManagementSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        environmentKey: record.environment_key as string,
        environmentName: record.environment_name as string,
        environmentType: record.environment_type as string,
        status: record.status,
    };
}

export function buildEnvironmentManagementPayload(organizationId: string, input: CreateEnvironmentManagementInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        environment_key: input.environmentKey ?? '',
        environment_name: input.environmentName ?? '',
        environment_type: input.environmentType ?? '',
        status: "active",
    };
}

export function mapDeploymentTrackingSummary(record: DbCsdDeploymentTracking, maps?: { hubNameById: Map<string, string> }): DeploymentTrackingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        trackingKey: record.tracking_key as string,
        deploymentName: record.deployment_name as string,
        deploymentStatus: record.deployment_status as string,
        status: record.status,
    };
}

export function buildDeploymentTrackingPayload(organizationId: string, input: CreateDeploymentTrackingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        tracking_key: input.trackingKey ?? '',
        deployment_name: input.deploymentName ?? '',
        deployment_status: input.deploymentStatus ?? '',
        status: "active",
    };
}

export function mapUpgradeManagementSummary(record: DbCsdUpgradeManagement, maps?: { hubNameById: Map<string, string> }): UpgradeManagementSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        upgradeKey: record.upgrade_key as string,
        upgradeName: record.upgrade_name as string,
        upgradeStatus: record.upgrade_status as string,
        status: record.status,
    };
}

export function buildUpgradeManagementPayload(organizationId: string, input: CreateUpgradeManagementInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        upgrade_key: input.upgradeKey ?? '',
        upgrade_name: input.upgradeName ?? '',
        upgrade_status: input.upgradeStatus ?? '',
        status: "active",
    };
}

export function mapReleaseTrackingSummary(record: DbCsdReleaseTracking, maps?: { hubNameById: Map<string, string> }): ReleaseTrackingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        releaseKey: record.release_key as string,
        releaseName: record.release_name as string,
        releaseStatus: record.release_status as string,
        status: record.status,
    };
}

export function buildReleaseTrackingPayload(organizationId: string, input: CreateReleaseTrackingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        release_key: input.releaseKey ?? '',
        release_name: input.releaseName ?? '',
        release_status: input.releaseStatus ?? '',
        status: "active",
    };
}

export function mapTrainingPortalSummary(record: DbCsdTrainingPortal, maps?: { hubNameById: Map<string, string> }): TrainingPortalSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        portalKey: record.portal_key as string,
        portalName: record.portal_name as string,
        portalType: record.portal_type as string,
        status: record.status,
    };
}

export function buildTrainingPortalPayload(organizationId: string, input: CreateTrainingPortalInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        portal_key: input.portalKey ?? '',
        portal_name: input.portalName ?? '',
        portal_type: input.portalType ?? '',
        status: "active",
    };
}

export function mapVideoLibrarySummary(record: DbCsdVideoLibrary, maps?: { hubNameById: Map<string, string> }): VideoLibrarySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        videoKey: record.video_key as string,
        videoTitle: record.video_title as string,
        videoCategory: record.video_category as string,
        status: record.status,
    };
}

export function buildVideoLibraryPayload(organizationId: string, input: CreateVideoLibraryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        video_key: input.videoKey ?? '',
        video_title: input.videoTitle ?? '',
        video_category: input.videoCategory ?? '',
        status: "active",
    };
}

export function mapProductTourSummary(record: DbCsdProductTour, maps?: { hubNameById: Map<string, string> }): ProductTourSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        tourKey: record.tour_key as string,
        tourName: record.tour_name as string,
        tourType: record.tour_type as string,
        status: record.status,
    };
}

export function buildProductTourPayload(organizationId: string, input: CreateProductTourInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        tour_key: input.tourKey ?? '',
        tour_name: input.tourName ?? '',
        tour_type: input.tourType ?? '',
        status: "active",
    };
}

export function mapCertificationSummary(record: DbCsdCertification, maps?: { hubNameById: Map<string, string> }): CertificationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        certificationKey: record.certification_key as string,
        certificationName: record.certification_name as string,
        certificationType: record.certification_type as string,
        status: record.status,
    };
}

export function buildCertificationPayload(organizationId: string, input: CreateCertificationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        certification_key: input.certificationKey ?? '',
        certification_name: input.certificationName ?? '',
        certification_type: input.certificationType ?? '',
        status: "active",
    };
}

export function mapProgressTrackingSummary(record: DbCsdProgressTracking, maps?: { hubNameById: Map<string, string> }): ProgressTrackingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        progressKey: record.progress_key as string,
        learnerRef: record.learner_ref as string,
        progressPercent: record.progress_percent as number,
        status: record.status,
    };
}

export function buildProgressTrackingPayload(organizationId: string, input: CreateProgressTrackingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        progress_key: input.progressKey ?? '',
        learner_ref: input.learnerRef ?? '',
        progress_percent: input.progressPercent ?? 0,
        status: "active",
    };
}

export function mapLearningAnalyticSummary(record: DbCsdLearningAnalytic, maps?: { hubNameById: Map<string, string> }): LearningAnalyticSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        metricName: record.metric_name as string,
        completionRate: record.completion_rate as number,
        status: record.status,
    };
}

export function buildLearningAnalyticPayload(organizationId: string, input: CreateLearningAnalyticInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        analytics_key: input.analyticsKey ?? '',
        metric_name: input.metricName ?? '',
        completion_rate: input.completionRate ?? 0,
        status: "active",
    };
}

export function mapDeliveryWorkflowSummary(record: DbCsdDeliveryWorkflow, maps?: { hubNameById: Map<string, string> }): DeliveryWorkflowSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        workflowKey: record.workflow_key as string,
        workflowName: record.workflow_name as string,
        workflowStatus: record.workflow_status as string,
        status: record.status,
    };
}

export function buildDeliveryWorkflowPayload(organizationId: string, input: CreateDeliveryWorkflowInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        workflow_key: input.workflowKey ?? '',
        workflow_name: input.workflowName ?? '',
        workflow_status: input.workflowStatus ?? '',
        status: "active",
    };
}

export function mapOnboardingAutomationSummary(record: DbCsdOnboardingAutomation, maps?: { hubNameById: Map<string, string> }): OnboardingAutomationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        automationKey: record.automation_key as string,
        automationName: record.automation_name as string,
        automationStatus: record.automation_status as string,
        status: record.status,
    };
}

export function buildOnboardingAutomationPayload(organizationId: string, input: CreateOnboardingAutomationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        automation_key: input.automationKey ?? '',
        automation_name: input.automationName ?? '',
        automation_status: input.automationStatus ?? '',
        status: "active",
    };
}

export function mapImplementationTrackingSummary(record: DbCsdImplementationTracking, maps?: { hubNameById: Map<string, string> }): ImplementationTrackingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        trackingKey: record.tracking_key as string,
        implementationName: record.implementation_name as string,
        implementationStatus: record.implementation_status as string,
        status: record.status,
    };
}

export function buildImplementationTrackingPayload(organizationId: string, input: CreateImplementationTrackingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        tracking_key: input.trackingKey ?? '',
        implementation_name: input.implementationName ?? '',
        implementation_status: input.implementationStatus ?? '',
        status: "active",
    };
}

export function mapResourceAssignmentSummary(record: DbCsdResourceAssignment, maps?: { hubNameById: Map<string, string> }): ResourceAssignmentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assignmentKey: record.assignment_key as string,
        resourceName: record.resource_name as string,
        resourceType: record.resource_type as string,
        status: record.status,
    };
}

export function buildResourceAssignmentPayload(organizationId: string, input: CreateResourceAssignmentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        assignment_key: input.assignmentKey ?? '',
        resource_name: input.resourceName ?? '',
        resource_type: input.resourceType ?? '',
        status: "active",
    };
}

export function mapMilestoneTrackingSummary(record: DbCsdMilestoneTracking, maps?: { hubNameById: Map<string, string> }): MilestoneTrackingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        milestoneKey: record.milestone_key as string,
        milestoneName: record.milestone_name as string,
        milestoneStatus: record.milestone_status as string,
        status: record.status,
    };
}

export function buildMilestoneTrackingPayload(organizationId: string, input: CreateMilestoneTrackingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        milestone_key: input.milestoneKey ?? '',
        milestone_name: input.milestoneName ?? '',
        milestone_status: input.milestoneStatus ?? '',
        status: "active",
    };
}

export function mapOperationsMetricSummary(record: DbCsdOperationsMetric): OperationsMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        customerHealthScore: record.customer_health_score as number,
        overallDeliveryScore: record.overall_delivery_score as number,
        status: record.status,
    };
}

export function buildOperationsMetricPayload(organizationId: string, input: CreateOperationsMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        customer_health_score: input.customerHealthScore ?? 0,
        overall_delivery_score: input.overallDeliveryScore ?? 0,
        status: "active",
    };
}

export function mapOperationsHealthSummary(record: DbCsdOperationsHealth): OperationsHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildOperationsHealthPayload(organizationId: string, input: CreateOperationsHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapExecutiveKpiSummary(record: DbCsdExecutiveKpi, maps?: { hubNameById: Map<string, string> }): ExecutiveKpiSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        kpiKey: record.kpi_key as string,
        kpiName: record.kpi_name as string,
        kpiScore: record.kpi_score as number,
        status: record.status,
    };
}

export function buildExecutiveKpiPayload(organizationId: string, input: CreateExecutiveKpiInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        kpi_key: input.kpiKey ?? '',
        kpi_name: input.kpiName ?? '',
        kpi_score: input.kpiScore ?? 0,
        status: "active",
    };
}

export function mapDeliveryFailureSummary(record: DbCsdDeliveryFailure, maps?: { hubNameById: Map<string, string> }): DeliveryFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildDeliveryFailurePayload(organizationId: string, input: CreateDeliveryFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.deliveryHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapCustomerHealthScoreForStats(r: DbCsdCustomerHealthScore) { return { health_score: r.health_score, status: r.status }; }
export function mapSupportTicketForStats(r: DbCsdSupportTicket) { return { ticket_status: r.ticket_status, status: r.status }; }
export function mapDeploymentTrackingForStats(r: DbCsdDeploymentTracking) { return { deployment_status: r.deployment_status, status: r.status }; }
export function mapTrainingPortalForStats(r: DbCsdTrainingPortal) { return { status: r.status }; }
export function mapOperationsMetricForStats(r: DbCsdOperationsMetric) {
    return {
        customer_health_score: r.customer_health_score,
        open_ticket_count: r.open_ticket_count,
        sla_compliance_score: r.sla_compliance_score,
        deployment_status_score: r.deployment_status_score,
        renewal_forecast_count: r.renewal_forecast_count,
        adoption_rate: r.adoption_rate,
        overall_delivery_score: r.overall_delivery_score,
        status: r.status,
    };
}
export function mapOperationsHealthForStats(r: DbCsdOperationsHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapDeliveryFailureForStats(r: DbCsdDeliveryFailure) { return { status: r.status }; }

export function buildCsdDashboardStats(input: {
    deliveryHubs: DeliveryHubSummary[];
    customerHealthScores: ReturnType<typeof mapCustomerHealthScoreForStats>[];
    supportTickets: ReturnType<typeof mapSupportTicketForStats>[];
    deploymentTracking: ReturnType<typeof mapDeploymentTrackingForStats>[];
    trainingPortals: ReturnType<typeof mapTrainingPortalForStats>[];
    operationsMetrics: ReturnType<typeof mapOperationsMetricForStats>[];
    operationsHealth: ReturnType<typeof mapOperationsHealthForStats>[];
    deliveryFailures: DeliveryFailureSummary[];
    auditLogs: AuditEntry[];
}): CsdDashboardStats {
    const activeHubs = input.deliveryHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.operationsMetrics[0];
    const latestHealth = input.operationsHealth[0];
    return {
        totalDeliveryHubs: input.deliveryHubs.length,
        activeDeliveryHubs: activeHubs,
        customerHealthScoreCount: input.customerHealthScores.length,
        supportTicketCount: input.supportTickets.length,
        deploymentTrackingCount: input.deploymentTracking.length,
        trainingPortalCount: input.trainingPortals.length,
        openDeliveryFailureCount: input.deliveryFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallDeliveryScore: latestMetrics?.overall_delivery_score ?? latestHealth?.overall_score ?? 0,
        customerHealthScore: latestMetrics?.customer_health_score ?? 0,
        openTicketCount: latestMetrics?.open_ticket_count ?? 0,
        slaComplianceScore: latestMetrics?.sla_compliance_score ?? 0,
        deploymentStatusScore: latestMetrics?.deployment_status_score ?? 0,
        renewalForecastCount: latestMetrics?.renewal_forecast_count ?? 0,
        adoptionRate: latestMetrics?.adoption_rate ?? 0,
        auditCount: input.auditLogs.length,
    };
}
