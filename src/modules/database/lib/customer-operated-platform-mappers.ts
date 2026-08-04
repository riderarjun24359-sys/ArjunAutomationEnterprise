import type { DbCopOperatedHub,
    DbCopSignupFlow,
    DbCopOrgProvisioning,
    DbCopDomainOnboarding,
    DbCopEmailVerification,
    DbCopOnboardingWizard,
    DbCopProductionProfile,
    DbCopDeploymentJob,
    DbCopHealthValidation,
    DbCopRollbackAutomation,
    DbCopDeploymentAudit,
    DbCopCentralLog,
    DbCopMetricsCollector,
    DbCopDistributedTrace,
    DbCopAlertRule,
    DbCopIncidentTimeline,
    DbCopBackupScheduler,
    DbCopRestoreValidation,
    DbCopMaintenanceMode,
    DbCopFeatureFlagOp,
    DbCopPlatformDiagnostic,
    DbCopBetaOrganization,
    DbCopBetaInvitation,
    DbCopFeedbackCollection,
    DbCopFeatureRequest,
    DbCopBugReport,
    DbCopReleaseChannel,
    DbCopOperatedMetric,
    DbCopOperatedHealth,
    DbCopExecutiveBriefing,
    DbCopPlatformFailure,
    DbCopAuditLog } from "@/src/modules/database/types/platform";
import type { CreateOperatedHubInput,
    OperatedHubSummary,
    CreateSignupFlowInput,
    SignupFlowSummary,
    CreateOrgProvisioningInput,
    OrgProvisioningSummary,
    CreateDomainOnboardingInput,
    DomainOnboardingSummary,
    CreateEmailVerificationInput,
    EmailVerificationSummary,
    CreateOnboardingWizardInput,
    OnboardingWizardSummary,
    CreateProductionProfileInput,
    ProductionProfileSummary,
    CreateDeploymentJobInput,
    DeploymentJobSummary,
    CreateHealthValidationInput,
    HealthValidationSummary,
    CreateRollbackAutomationInput,
    RollbackAutomationSummary,
    CreateDeploymentAuditInput,
    DeploymentAuditSummary,
    CreateCentralLogInput,
    CentralLogSummary,
    CreateMetricsCollectorInput,
    MetricsCollectorSummary,
    CreateDistributedTraceInput,
    DistributedTraceSummary,
    CreateAlertRuleInput,
    AlertRuleSummary,
    CreateIncidentTimelineInput,
    IncidentTimelineSummary,
    CreateBackupSchedulerInput,
    BackupSchedulerSummary,
    CreateRestoreValidationInput,
    RestoreValidationSummary,
    CreateMaintenanceModeInput,
    MaintenanceModeSummary,
    CreateFeatureFlagOpInput,
    FeatureFlagOpSummary,
    CreatePlatformDiagnosticInput,
    PlatformDiagnosticSummary,
    CreateBetaOrganizationInput,
    BetaOrganizationSummary,
    CreateBetaInvitationInput,
    BetaInvitationSummary,
    CreateFeedbackCollectionInput,
    FeedbackCollectionSummary,
    CreateFeatureRequestInput,
    FeatureRequestSummary,
    CreateBugReportInput,
    BugReportSummary,
    CreateReleaseChannelInput,
    ReleaseChannelSummary,
    CreateOperatedMetricInput,
    OperatedMetricSummary,
    CreateOperatedHealthInput,
    OperatedHealthSummary,
    CreateExecutiveBriefingInput,
    ExecutiveBriefingSummary,
    CreatePlatformFailureInput,
    PlatformFailureSummary,
    CopDashboardStats,
    CopPipelineInfo,
    AuditEntry } from "@/src/modules/customer-operated-platform/types";

export function buildOperatedHubLookupMaps(hubs: DbCopOperatedHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildCopPipelineInfo(): CopPipelineInfo {
    const stages = [
        { key: "onboarding", label: "Onboarding" },
        { key: "production", label: "Production" },
        { key: "observability", label: "Observability" },
        { key: "operations", label: "Operations" },
        { key: "beta", label: "Beta" },
        { key: "dashboard", label: "Dashboard" },
    ];
    return { stages, currentStage: "production", nextStage: "observability", previousStage: "onboarding" };
}

export function buildCopAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbCopAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapOperatedHubSummary(record: DbCopOperatedHub): OperatedHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildOperatedHubPayload(organizationId: string, input: CreateOperatedHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapSignupFlowSummary(record: DbCopSignupFlow, maps?: { hubNameById: Map<string, string> }): SignupFlowSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        flowKey: record.flow_key as string,
        flowName: record.flow_name as string,
        flowStatus: record.flow_status as string,
        status: record.status,
    };
}

export function buildSignupFlowPayload(organizationId: string, input: CreateSignupFlowInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        flow_key: input.flowKey ?? '',
        flow_name: input.flowName ?? '',
        flow_status: input.flowStatus ?? '',
        status: "active",
    };
}

export function mapOrgProvisioningSummary(record: DbCopOrgProvisioning, maps?: { hubNameById: Map<string, string> }): OrgProvisioningSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        provisionKey: record.provision_key as string,
        provisionName: record.provision_name as string,
        provisionStatus: record.provision_status as string,
        status: record.status,
    };
}

export function buildOrgProvisioningPayload(organizationId: string, input: CreateOrgProvisioningInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        provision_key: input.provisionKey ?? '',
        provision_name: input.provisionName ?? '',
        provision_status: input.provisionStatus ?? '',
        status: "active",
    };
}

export function mapDomainOnboardingSummary(record: DbCopDomainOnboarding, maps?: { hubNameById: Map<string, string> }): DomainOnboardingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        domainKey: record.domain_key as string,
        domainName: record.domain_name as string,
        domainStatus: record.domain_status as string,
        status: record.status,
    };
}

export function buildDomainOnboardingPayload(organizationId: string, input: CreateDomainOnboardingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        domain_key: input.domainKey ?? '',
        domain_name: input.domainName ?? '',
        domain_status: input.domainStatus ?? '',
        status: "active",
    };
}

export function mapEmailVerificationSummary(record: DbCopEmailVerification, maps?: { hubNameById: Map<string, string> }): EmailVerificationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        verificationKey: record.verification_key as string,
        emailAddress: record.email_address as string,
        verificationStatus: record.verification_status as string,
        status: record.status,
    };
}

export function buildEmailVerificationPayload(organizationId: string, input: CreateEmailVerificationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        verification_key: input.verificationKey ?? '',
        email_address: input.emailAddress ?? '',
        verification_status: input.verificationStatus ?? '',
        status: "active",
    };
}

export function mapOnboardingWizardSummary(record: DbCopOnboardingWizard, maps?: { hubNameById: Map<string, string> }): OnboardingWizardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        wizardKey: record.wizard_key as string,
        wizardName: record.wizard_name as string,
        wizardStatus: record.wizard_status as string,
        status: record.status,
    };
}

export function buildOnboardingWizardPayload(organizationId: string, input: CreateOnboardingWizardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        wizard_key: input.wizardKey ?? '',
        wizard_name: input.wizardName ?? '',
        wizard_status: input.wizardStatus ?? '',
        status: "active",
    };
}

export function mapProductionProfileSummary(record: DbCopProductionProfile, maps?: { hubNameById: Map<string, string> }): ProductionProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        profileStatus: record.profile_status as string,
        status: record.status,
    };
}

export function buildProductionProfilePayload(organizationId: string, input: CreateProductionProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        profile_status: input.profileStatus ?? '',
        status: "active",
    };
}

export function mapDeploymentJobSummary(record: DbCopDeploymentJob, maps?: { hubNameById: Map<string, string> }): DeploymentJobSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        jobKey: record.job_key as string,
        jobName: record.job_name as string,
        jobStatus: record.job_status as string,
        status: record.status,
    };
}

export function buildDeploymentJobPayload(organizationId: string, input: CreateDeploymentJobInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        job_key: input.jobKey ?? '',
        job_name: input.jobName ?? '',
        job_status: input.jobStatus ?? '',
        status: "active",
    };
}

export function mapHealthValidationSummary(record: DbCopHealthValidation, maps?: { hubNameById: Map<string, string> }): HealthValidationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        validationKey: record.validation_key as string,
        validationName: record.validation_name as string,
        validationStatus: record.validation_status as string,
        status: record.status,
    };
}

export function buildHealthValidationPayload(organizationId: string, input: CreateHealthValidationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        validation_key: input.validationKey ?? '',
        validation_name: input.validationName ?? '',
        validation_status: input.validationStatus ?? '',
        status: "active",
    };
}

export function mapRollbackAutomationSummary(record: DbCopRollbackAutomation, maps?: { hubNameById: Map<string, string> }): RollbackAutomationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        rollbackKey: record.rollback_key as string,
        rollbackName: record.rollback_name as string,
        rollbackStatus: record.rollback_status as string,
        status: record.status,
    };
}

export function buildRollbackAutomationPayload(organizationId: string, input: CreateRollbackAutomationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        rollback_key: input.rollbackKey ?? '',
        rollback_name: input.rollbackName ?? '',
        rollback_status: input.rollbackStatus ?? '',
        status: "active",
    };
}

export function mapDeploymentAuditSummary(record: DbCopDeploymentAudit, maps?: { hubNameById: Map<string, string> }): DeploymentAuditSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        auditKey: record.audit_key as string,
        auditName: record.audit_name as string,
        auditStatus: record.audit_status as string,
        status: record.status,
    };
}

export function buildDeploymentAuditPayload(organizationId: string, input: CreateDeploymentAuditInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        audit_key: input.auditKey ?? '',
        audit_name: input.auditName ?? '',
        audit_status: input.auditStatus ?? '',
        status: "active",
    };
}

export function mapCentralLogSummary(record: DbCopCentralLog, maps?: { hubNameById: Map<string, string> }): CentralLogSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        logKey: record.log_key as string,
        logSource: record.log_source as string,
        logLevel: record.log_level as string,
        status: record.status,
    };
}

export function buildCentralLogPayload(organizationId: string, input: CreateCentralLogInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        log_key: input.logKey ?? '',
        log_source: input.logSource ?? '',
        log_level: input.logLevel ?? '',
        status: "active",
    };
}

export function mapMetricsCollectorSummary(record: DbCopMetricsCollector, maps?: { hubNameById: Map<string, string> }): MetricsCollectorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        collectorKey: record.collector_key as string,
        collectorName: record.collector_name as string,
        collectorStatus: record.collector_status as string,
        status: record.status,
    };
}

export function buildMetricsCollectorPayload(organizationId: string, input: CreateMetricsCollectorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        collector_key: input.collectorKey ?? '',
        collector_name: input.collectorName ?? '',
        collector_status: input.collectorStatus ?? '',
        status: "active",
    };
}

export function mapDistributedTraceSummary(record: DbCopDistributedTrace, maps?: { hubNameById: Map<string, string> }): DistributedTraceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        traceKey: record.trace_key as string,
        traceName: record.trace_name as string,
        traceStatus: record.trace_status as string,
        status: record.status,
    };
}

export function buildDistributedTracePayload(organizationId: string, input: CreateDistributedTraceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        trace_key: input.traceKey ?? '',
        trace_name: input.traceName ?? '',
        trace_status: input.traceStatus ?? '',
        status: "active",
    };
}

export function mapAlertRuleSummary(record: DbCopAlertRule, maps?: { hubNameById: Map<string, string> }): AlertRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        severity: record.severity as string,
        status: record.status,
    };
}

export function buildAlertRulePayload(organizationId: string, input: CreateAlertRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        severity: input.severity ?? '',
        status: "active",
    };
}

export function mapIncidentTimelineSummary(record: DbCopIncidentTimeline, maps?: { hubNameById: Map<string, string> }): IncidentTimelineSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        incidentKey: record.incident_key as string,
        incidentTitle: record.incident_title as string,
        incidentStatus: record.incident_status as string,
        status: record.status,
    };
}

export function buildIncidentTimelinePayload(organizationId: string, input: CreateIncidentTimelineInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        incident_key: input.incidentKey ?? '',
        incident_title: input.incidentTitle ?? '',
        incident_status: input.incidentStatus ?? '',
        status: "active",
    };
}

export function mapBackupSchedulerSummary(record: DbCopBackupScheduler, maps?: { hubNameById: Map<string, string> }): BackupSchedulerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        scheduleKey: record.schedule_key as string,
        scheduleName: record.schedule_name as string,
        scheduleStatus: record.schedule_status as string,
        status: record.status,
    };
}

export function buildBackupSchedulerPayload(organizationId: string, input: CreateBackupSchedulerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        schedule_key: input.scheduleKey ?? '',
        schedule_name: input.scheduleName ?? '',
        schedule_status: input.scheduleStatus ?? '',
        status: "active",
    };
}

export function mapRestoreValidationSummary(record: DbCopRestoreValidation, maps?: { hubNameById: Map<string, string> }): RestoreValidationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        restoreKey: record.restore_key as string,
        restoreName: record.restore_name as string,
        restoreStatus: record.restore_status as string,
        status: record.status,
    };
}

export function buildRestoreValidationPayload(organizationId: string, input: CreateRestoreValidationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        restore_key: input.restoreKey ?? '',
        restore_name: input.restoreName ?? '',
        restore_status: input.restoreStatus ?? '',
        status: "active",
    };
}

export function mapMaintenanceModeSummary(record: DbCopMaintenanceMode, maps?: { hubNameById: Map<string, string> }): MaintenanceModeSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        maintenanceKey: record.maintenance_key as string,
        maintenanceName: record.maintenance_name as string,
        maintenanceStatus: record.maintenance_status as string,
        status: record.status,
    };
}

export function buildMaintenanceModePayload(organizationId: string, input: CreateMaintenanceModeInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        maintenance_key: input.maintenanceKey ?? '',
        maintenance_name: input.maintenanceName ?? '',
        maintenance_status: input.maintenanceStatus ?? '',
        status: "active",
    };
}

export function mapFeatureFlagOpSummary(record: DbCopFeatureFlagOp, maps?: { hubNameById: Map<string, string> }): FeatureFlagOpSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        flagKey: record.flag_key as string,
        flagName: record.flag_name as string,
        flagStatus: record.flag_status as string,
        status: record.status,
    };
}

export function buildFeatureFlagOpPayload(organizationId: string, input: CreateFeatureFlagOpInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        flag_key: input.flagKey ?? '',
        flag_name: input.flagName ?? '',
        flag_status: input.flagStatus ?? '',
        status: "active",
    };
}

export function mapPlatformDiagnosticSummary(record: DbCopPlatformDiagnostic, maps?: { hubNameById: Map<string, string> }): PlatformDiagnosticSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        diagnosticKey: record.diagnostic_key as string,
        diagnosticName: record.diagnostic_name as string,
        diagnosticStatus: record.diagnostic_status as string,
        status: record.status,
    };
}

export function buildPlatformDiagnosticPayload(organizationId: string, input: CreatePlatformDiagnosticInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        diagnostic_key: input.diagnosticKey ?? '',
        diagnostic_name: input.diagnosticName ?? '',
        diagnostic_status: input.diagnosticStatus ?? '',
        status: "active",
    };
}

export function mapBetaOrganizationSummary(record: DbCopBetaOrganization, maps?: { hubNameById: Map<string, string> }): BetaOrganizationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        orgKey: record.org_key as string,
        orgName: record.org_name as string,
        betaStatus: record.beta_status as string,
        status: record.status,
    };
}

export function buildBetaOrganizationPayload(organizationId: string, input: CreateBetaOrganizationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        org_key: input.orgKey ?? '',
        org_name: input.orgName ?? '',
        beta_status: input.betaStatus ?? '',
        status: "active",
    };
}

export function mapBetaInvitationSummary(record: DbCopBetaInvitation, maps?: { hubNameById: Map<string, string> }): BetaInvitationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        invitationKey: record.invitation_key as string,
        inviteeEmail: record.invitee_email as string,
        invitationStatus: record.invitation_status as string,
        status: record.status,
    };
}

export function buildBetaInvitationPayload(organizationId: string, input: CreateBetaInvitationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        invitation_key: input.invitationKey ?? '',
        invitee_email: input.inviteeEmail ?? '',
        invitation_status: input.invitationStatus ?? '',
        status: "active",
    };
}

export function mapFeedbackCollectionSummary(record: DbCopFeedbackCollection, maps?: { hubNameById: Map<string, string> }): FeedbackCollectionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        feedbackKey: record.feedback_key as string,
        feedbackTitle: record.feedback_title as string,
        feedbackType: record.feedback_type as string,
        status: record.status,
    };
}

export function buildFeedbackCollectionPayload(organizationId: string, input: CreateFeedbackCollectionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        feedback_key: input.feedbackKey ?? '',
        feedback_title: input.feedbackTitle ?? '',
        feedback_type: input.feedbackType ?? '',
        status: "active",
    };
}

export function mapFeatureRequestSummary(record: DbCopFeatureRequest, maps?: { hubNameById: Map<string, string> }): FeatureRequestSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        requestKey: record.request_key as string,
        requestTitle: record.request_title as string,
        requestStatus: record.request_status as string,
        status: record.status,
    };
}

export function buildFeatureRequestPayload(organizationId: string, input: CreateFeatureRequestInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        request_key: input.requestKey ?? '',
        request_title: input.requestTitle ?? '',
        request_status: input.requestStatus ?? '',
        status: "active",
    };
}

export function mapBugReportSummary(record: DbCopBugReport, maps?: { hubNameById: Map<string, string> }): BugReportSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        bugKey: record.bug_key as string,
        bugTitle: record.bug_title as string,
        bugStatus: record.bug_status as string,
        status: record.status,
    };
}

export function buildBugReportPayload(organizationId: string, input: CreateBugReportInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        bug_key: input.bugKey ?? '',
        bug_title: input.bugTitle ?? '',
        bug_status: input.bugStatus ?? '',
        status: "active",
    };
}

export function mapReleaseChannelSummary(record: DbCopReleaseChannel, maps?: { hubNameById: Map<string, string> }): ReleaseChannelSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        channelKey: record.channel_key as string,
        channelName: record.channel_name as string,
        channelStatus: record.channel_status as string,
        status: record.status,
    };
}

export function buildReleaseChannelPayload(organizationId: string, input: CreateReleaseChannelInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        channel_key: input.channelKey ?? '',
        channel_name: input.channelName ?? '',
        channel_status: input.channelStatus ?? '',
        status: "active",
    };
}

export function mapOperatedMetricSummary(record: DbCopOperatedMetric): OperatedMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        productionStatusScore: record.production_status_score as number,
        overallOperatedScore: record.overall_operated_score as number,
        status: record.status,
    };
}

export function buildOperatedMetricPayload(organizationId: string, input: CreateOperatedMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        production_status_score: input.productionStatusScore ?? 0,
        overall_operated_score: input.overallOperatedScore ?? 0,
        status: "active",
    };
}

export function mapOperatedHealthSummary(record: DbCopOperatedHealth): OperatedHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildOperatedHealthPayload(organizationId: string, input: CreateOperatedHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapExecutiveBriefingSummary(record: DbCopExecutiveBriefing, maps?: { hubNameById: Map<string, string> }): ExecutiveBriefingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        briefingKey: record.briefing_key as string,
        briefingTitle: record.briefing_title as string,
        briefingType: record.briefing_type as string,
        status: record.status,
    };
}

export function buildExecutiveBriefingPayload(organizationId: string, input: CreateExecutiveBriefingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        briefing_key: input.briefingKey ?? '',
        briefing_title: input.briefingTitle ?? '',
        briefing_type: input.briefingType ?? '',
        status: "active",
    };
}

export function mapPlatformFailureSummary(record: DbCopPlatformFailure, maps?: { hubNameById: Map<string, string> }): PlatformFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildPlatformFailurePayload(organizationId: string, input: CreatePlatformFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.operatedHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapSignupFlowForStats(r: DbCopSignupFlow) { return { flow_status: r.flow_status, status: r.status }; }
export function mapDeploymentJobForStats(r: DbCopDeploymentJob) { return { job_status: r.job_status, status: r.status }; }
export function mapProductionProfileForStats(r: DbCopProductionProfile) { return { profile_status: r.profile_status, status: r.status }; }
export function mapCentralLogForStats(r: DbCopCentralLog) { return { log_level: r.log_level, status: r.status }; }
export function mapOperatedMetricForStats(r: DbCopOperatedMetric) {
    return {
        production_status_score: r.production_status_score,
        onboarding_completion_rate: r.onboarding_completion_rate,
        revenue_today: r.revenue_today,
        active_incident_count: r.active_incident_count,
        pending_approval_count: r.pending_approval_count,
        platform_availability_score: r.platform_availability_score,
        customer_satisfaction_score: r.customer_satisfaction_score,
        overall_operated_score: r.overall_operated_score,
        status: r.status,
    };
}
export function mapOperatedHealthForStats(r: DbCopOperatedHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapPlatformFailureForStats(r: DbCopPlatformFailure) { return { status: r.status }; }

export function buildCopDashboardStats(input: {
    operatedHubs: OperatedHubSummary[];
    signupFlows: ReturnType<typeof mapSignupFlowForStats>[];
    deploymentJobs: ReturnType<typeof mapDeploymentJobForStats>[];
    productionProfiles: ReturnType<typeof mapProductionProfileForStats>[];
    centralLogs: ReturnType<typeof mapCentralLogForStats>[];
    operatedMetrics: ReturnType<typeof mapOperatedMetricForStats>[];
    operatedHealth: ReturnType<typeof mapOperatedHealthForStats>[];
    platformFailures: PlatformFailureSummary[];
    auditLogs: AuditEntry[];
}): CopDashboardStats {
    const activeHubs = input.operatedHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.operatedMetrics[0];
    const latestHealth = input.operatedHealth[0];
    return {
        totalOperatedHubs: input.operatedHubs.length,
        activeOperatedHubs: activeHubs,
        signupFlowCount: input.signupFlows.length,
        deploymentJobCount: input.deploymentJobs.length,
        productionProfileCount: input.productionProfiles.length,
        centralLogCount: input.centralLogs.length,
        openPlatformFailureCount: input.platformFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallOperatedScore: latestMetrics?.overall_operated_score ?? latestHealth?.overall_score ?? 0,
        productionStatusScore: latestMetrics?.production_status_score ?? 0,
        onboardingCompletionRate: latestMetrics?.onboarding_completion_rate ?? 0,
        revenueToday: latestMetrics?.revenue_today ?? 0,
        activeIncidentCount: latestMetrics?.active_incident_count ?? 0,
        pendingApprovalCount: latestMetrics?.pending_approval_count ?? 0,
        platformAvailabilityScore: latestMetrics?.platform_availability_score ?? 0,
        customerSatisfactionScore: latestMetrics?.customer_satisfaction_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
