import {
    buildOperatedHubLookupMaps,
    buildCopAuditPayload,
    buildCopDashboardStats,
    buildCopPipelineInfo,
    mapAuditEntry,
    buildOperatedHubPayload,
    mapOperatedHubSummary,
    buildSignupFlowPayload,
    mapSignupFlowSummary,
    buildOrgProvisioningPayload,
    mapOrgProvisioningSummary,
    buildDomainOnboardingPayload,
    mapDomainOnboardingSummary,
    buildEmailVerificationPayload,
    mapEmailVerificationSummary,
    buildOnboardingWizardPayload,
    mapOnboardingWizardSummary,
    buildProductionProfilePayload,
    mapProductionProfileSummary,
    buildDeploymentJobPayload,
    mapDeploymentJobSummary,
    buildHealthValidationPayload,
    mapHealthValidationSummary,
    buildRollbackAutomationPayload,
    mapRollbackAutomationSummary,
    buildDeploymentAuditPayload,
    mapDeploymentAuditSummary,
    buildCentralLogPayload,
    mapCentralLogSummary,
    buildMetricsCollectorPayload,
    mapMetricsCollectorSummary,
    buildDistributedTracePayload,
    mapDistributedTraceSummary,
    buildAlertRulePayload,
    mapAlertRuleSummary,
    buildIncidentTimelinePayload,
    mapIncidentTimelineSummary,
    buildBackupSchedulerPayload,
    mapBackupSchedulerSummary,
    buildRestoreValidationPayload,
    mapRestoreValidationSummary,
    buildMaintenanceModePayload,
    mapMaintenanceModeSummary,
    buildFeatureFlagOpPayload,
    mapFeatureFlagOpSummary,
    buildPlatformDiagnosticPayload,
    mapPlatformDiagnosticSummary,
    buildBetaOrganizationPayload,
    mapBetaOrganizationSummary,
    buildBetaInvitationPayload,
    mapBetaInvitationSummary,
    buildFeedbackCollectionPayload,
    mapFeedbackCollectionSummary,
    buildFeatureRequestPayload,
    mapFeatureRequestSummary,
    buildBugReportPayload,
    mapBugReportSummary,
    buildReleaseChannelPayload,
    mapReleaseChannelSummary,
    buildOperatedMetricPayload,
    mapOperatedMetricSummary,
    buildOperatedHealthPayload,
    mapOperatedHealthSummary,
    buildExecutiveBriefingPayload,
    mapExecutiveBriefingSummary,
    buildPlatformFailurePayload,
    mapPlatformFailureSummary,
    mapSignupFlowForStats,
    mapDeploymentJobForStats,
    mapOperatedMetricForStats,
    mapProductionProfileForStats,
    mapCentralLogForStats,
    mapOperatedHealthForStats,
    mapPlatformFailureForStats,
} from "@/src/modules/database/lib/customer-operated-platform-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";
import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";
import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";
import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";
import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";
import type {
    OperatedHubSummary,
    CreateOperatedHubInput,
    SignupFlowSummary,
    CreateSignupFlowInput,
    OrgProvisioningSummary,
    CreateOrgProvisioningInput,
    DomainOnboardingSummary,
    CreateDomainOnboardingInput,
    EmailVerificationSummary,
    CreateEmailVerificationInput,
    OnboardingWizardSummary,
    CreateOnboardingWizardInput,
    ProductionProfileSummary,
    CreateProductionProfileInput,
    DeploymentJobSummary,
    CreateDeploymentJobInput,
    HealthValidationSummary,
    CreateHealthValidationInput,
    RollbackAutomationSummary,
    CreateRollbackAutomationInput,
    DeploymentAuditSummary,
    CreateDeploymentAuditInput,
    CentralLogSummary,
    CreateCentralLogInput,
    MetricsCollectorSummary,
    CreateMetricsCollectorInput,
    DistributedTraceSummary,
    CreateDistributedTraceInput,
    AlertRuleSummary,
    CreateAlertRuleInput,
    IncidentTimelineSummary,
    CreateIncidentTimelineInput,
    BackupSchedulerSummary,
    CreateBackupSchedulerInput,
    RestoreValidationSummary,
    CreateRestoreValidationInput,
    MaintenanceModeSummary,
    CreateMaintenanceModeInput,
    FeatureFlagOpSummary,
    CreateFeatureFlagOpInput,
    PlatformDiagnosticSummary,
    CreatePlatformDiagnosticInput,
    BetaOrganizationSummary,
    CreateBetaOrganizationInput,
    BetaInvitationSummary,
    CreateBetaInvitationInput,
    FeedbackCollectionSummary,
    CreateFeedbackCollectionInput,
    FeatureRequestSummary,
    CreateFeatureRequestInput,
    BugReportSummary,
    CreateBugReportInput,
    ReleaseChannelSummary,
    CreateReleaseChannelInput,
    OperatedMetricSummary,
    CreateOperatedMetricInput,
    OperatedHealthSummary,
    CreateOperatedHealthInput,
    ExecutiveBriefingSummary,
    CreateExecutiveBriefingInput,
    PlatformFailureSummary,
    CreatePlatformFailureInput,
    AuditEntry,
    CopDashboardStats,
    CopPipelineInfo,
    CopSdkLaunchOnboardingInput,
    CopSdkLaunchOnboardingResult,
    CopSdkDeployProductionInput,
    CopSdkDeployProductionResult,
    CopSdkMonitorPlatformInput,
    CopSdkMonitorPlatformResult,
} from "@/src/modules/customer-operated-platform/types";

export class CustomerOperatedPlatformService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const operatedHubs = await databaseService.copOperatedHubs.listByOrganization(organizationId);
        return buildOperatedHubLookupMaps(operatedHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CopDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildCopDashboardStats({ operatedHubs: [], signupFlows: [], deploymentJobs: [], productionProfiles: [], centralLogs: [], operatedMetrics: [], operatedHealth: [], platformFailures: [], auditLogs: [] });
        const [operatedHubs, signupFlowsRaw, deploymentJobsRaw, productionProfilesRaw, centralLogsRaw, operatedMetricsRaw, operatedHealthRaw, platformFailures, auditLogs] = await Promise.all([
            this.getOperatedHubs(authUserId, email, fullName),
            databaseService.copSignupFlows.listByOrganization(context.organizationId),
            databaseService.copDeploymentJobs.listByOrganization(context.organizationId),
            databaseService.copProductionProfiles.listByOrganization(context.organizationId),
            databaseService.copCentralLogs.listByOrganization(context.organizationId),
            databaseService.copOperatedMetrics.listByOrganization(context.organizationId),
            databaseService.copOperatedHealth.listByOrganization(context.organizationId),
            this.getPlatformFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildCopDashboardStats({
            operatedHubs,
            signupFlows: signupFlowsRaw.map(mapSignupFlowForStats),
            deploymentJobs: deploymentJobsRaw.map(mapDeploymentJobForStats),
            productionProfiles: productionProfilesRaw.map(mapProductionProfileForStats),
            centralLogs: centralLogsRaw.map(mapCentralLogForStats),
            operatedMetrics: operatedMetricsRaw.map(mapOperatedMetricForStats),
            operatedHealth: operatedHealthRaw.map(mapOperatedHealthForStats),
            platformFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): CopPipelineInfo {
        return buildCopPipelineInfo();
    }

    async getOperatedHubs(authUserId: string, email: string, fullName?: string | null): Promise<OperatedHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.copOperatedHubs.listByOrganization(context.organizationId)).map((r) => mapOperatedHubSummary(r));
    }

    async createOperatedHub(authUserId: string, email: string, input: CreateOperatedHubInput, fullName?: string | null): Promise<OperatedHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copOperatedHubs.create(buildOperatedHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operatedHubs");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "operated_hubs", "create", `OperatedHub created`, created.id));
        return mapOperatedHubSummary(created);
    }

    async getSignupFlows(authUserId: string, email: string, fullName?: string | null): Promise<SignupFlowSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copSignupFlows.listByOrganization(context.organizationId)).map((r) => mapSignupFlowSummary(r, maps));
    }

    async createSignupFlow(authUserId: string, email: string, input: CreateSignupFlowInput, fullName?: string | null): Promise<SignupFlowSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copSignupFlows.create(buildSignupFlowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create signupFlows");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "signup_flows", "create", `SignupFlow created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSignupFlowSummary(created, maps);
    }

    async getOrgProvisionings(authUserId: string, email: string, fullName?: string | null): Promise<OrgProvisioningSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copOrgProvisioning.listByOrganization(context.organizationId)).map((r) => mapOrgProvisioningSummary(r, maps));
    }

    async createOrgProvisioning(authUserId: string, email: string, input: CreateOrgProvisioningInput, fullName?: string | null): Promise<OrgProvisioningSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copOrgProvisioning.create(buildOrgProvisioningPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create orgProvisioning");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "org_provisioning", "create", `OrgProvisioning created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOrgProvisioningSummary(created, maps);
    }

    async getDomainOnboardings(authUserId: string, email: string, fullName?: string | null): Promise<DomainOnboardingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copDomainOnboarding.listByOrganization(context.organizationId)).map((r) => mapDomainOnboardingSummary(r, maps));
    }

    async createDomainOnboarding(authUserId: string, email: string, input: CreateDomainOnboardingInput, fullName?: string | null): Promise<DomainOnboardingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copDomainOnboarding.create(buildDomainOnboardingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create domainOnboarding");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "domain_onboarding", "create", `DomainOnboarding created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDomainOnboardingSummary(created, maps);
    }

    async getEmailVerifications(authUserId: string, email: string, fullName?: string | null): Promise<EmailVerificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copEmailVerifications.listByOrganization(context.organizationId)).map((r) => mapEmailVerificationSummary(r, maps));
    }

    async createEmailVerification(authUserId: string, email: string, input: CreateEmailVerificationInput, fullName?: string | null): Promise<EmailVerificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copEmailVerifications.create(buildEmailVerificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create emailVerifications");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "email_verifications", "create", `EmailVerification created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEmailVerificationSummary(created, maps);
    }

    async getOnboardingWizards(authUserId: string, email: string, fullName?: string | null): Promise<OnboardingWizardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copOnboardingWizards.listByOrganization(context.organizationId)).map((r) => mapOnboardingWizardSummary(r, maps));
    }

    async createOnboardingWizard(authUserId: string, email: string, input: CreateOnboardingWizardInput, fullName?: string | null): Promise<OnboardingWizardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copOnboardingWizards.create(buildOnboardingWizardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create onboardingWizards");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "onboarding_wizards", "create", `OnboardingWizard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapOnboardingWizardSummary(created, maps);
    }

    async getProductionProfiles(authUserId: string, email: string, fullName?: string | null): Promise<ProductionProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copProductionProfiles.listByOrganization(context.organizationId)).map((r) => mapProductionProfileSummary(r, maps));
    }

    async createProductionProfile(authUserId: string, email: string, input: CreateProductionProfileInput, fullName?: string | null): Promise<ProductionProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copProductionProfiles.create(buildProductionProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create productionProfiles");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "production_profiles", "create", `ProductionProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProductionProfileSummary(created, maps);
    }

    async getDeploymentJobs(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentJobSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copDeploymentJobs.listByOrganization(context.organizationId)).map((r) => mapDeploymentJobSummary(r, maps));
    }

    async createDeploymentJob(authUserId: string, email: string, input: CreateDeploymentJobInput, fullName?: string | null): Promise<DeploymentJobSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copDeploymentJobs.create(buildDeploymentJobPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deploymentJobs");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "deployment_jobs", "create", `DeploymentJob created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentJobSummary(created, maps);
    }

    async getHealthValidations(authUserId: string, email: string, fullName?: string | null): Promise<HealthValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copHealthValidations.listByOrganization(context.organizationId)).map((r) => mapHealthValidationSummary(r, maps));
    }

    async createHealthValidation(authUserId: string, email: string, input: CreateHealthValidationInput, fullName?: string | null): Promise<HealthValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copHealthValidations.create(buildHealthValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create healthValidations");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "health_validations", "create", `HealthValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthValidationSummary(created, maps);
    }

    async getRollbackAutomations(authUserId: string, email: string, fullName?: string | null): Promise<RollbackAutomationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copRollbackAutomations.listByOrganization(context.organizationId)).map((r) => mapRollbackAutomationSummary(r, maps));
    }

    async createRollbackAutomation(authUserId: string, email: string, input: CreateRollbackAutomationInput, fullName?: string | null): Promise<RollbackAutomationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copRollbackAutomations.create(buildRollbackAutomationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rollbackAutomations");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "rollback_automations", "create", `RollbackAutomation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRollbackAutomationSummary(created, maps);
    }

    async getDeploymentAudits(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentAuditSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copDeploymentAudits.listByOrganization(context.organizationId)).map((r) => mapDeploymentAuditSummary(r, maps));
    }

    async createDeploymentAudit(authUserId: string, email: string, input: CreateDeploymentAuditInput, fullName?: string | null): Promise<DeploymentAuditSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copDeploymentAudits.create(buildDeploymentAuditPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deploymentAudits");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "deployment_audits", "create", `DeploymentAudit created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentAuditSummary(created, maps);
    }

    async getCentralLogs(authUserId: string, email: string, fullName?: string | null): Promise<CentralLogSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copCentralLogs.listByOrganization(context.organizationId)).map((r) => mapCentralLogSummary(r, maps));
    }

    async createCentralLog(authUserId: string, email: string, input: CreateCentralLogInput, fullName?: string | null): Promise<CentralLogSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copCentralLogs.create(buildCentralLogPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create centralLogs");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "central_logs", "create", `CentralLog created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCentralLogSummary(created, maps);
    }

    async getMetricsCollectors(authUserId: string, email: string, fullName?: string | null): Promise<MetricsCollectorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copMetricsCollectors.listByOrganization(context.organizationId)).map((r) => mapMetricsCollectorSummary(r, maps));
    }

    async createMetricsCollector(authUserId: string, email: string, input: CreateMetricsCollectorInput, fullName?: string | null): Promise<MetricsCollectorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copMetricsCollectors.create(buildMetricsCollectorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create metricsCollectors");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "metrics_collectors", "create", `MetricsCollector created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMetricsCollectorSummary(created, maps);
    }

    async getDistributedTraces(authUserId: string, email: string, fullName?: string | null): Promise<DistributedTraceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copDistributedTraces.listByOrganization(context.organizationId)).map((r) => mapDistributedTraceSummary(r, maps));
    }

    async createDistributedTrace(authUserId: string, email: string, input: CreateDistributedTraceInput, fullName?: string | null): Promise<DistributedTraceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copDistributedTraces.create(buildDistributedTracePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create distributedTraces");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "distributed_traces", "create", `DistributedTrace created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDistributedTraceSummary(created, maps);
    }

    async getAlertRules(authUserId: string, email: string, fullName?: string | null): Promise<AlertRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copAlertRules.listByOrganization(context.organizationId)).map((r) => mapAlertRuleSummary(r, maps));
    }

    async createAlertRule(authUserId: string, email: string, input: CreateAlertRuleInput, fullName?: string | null): Promise<AlertRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copAlertRules.create(buildAlertRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create alertRules");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "alert_rules", "create", `AlertRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAlertRuleSummary(created, maps);
    }

    async getIncidentTimelines(authUserId: string, email: string, fullName?: string | null): Promise<IncidentTimelineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copIncidentTimelines.listByOrganization(context.organizationId)).map((r) => mapIncidentTimelineSummary(r, maps));
    }

    async createIncidentTimeline(authUserId: string, email: string, input: CreateIncidentTimelineInput, fullName?: string | null): Promise<IncidentTimelineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copIncidentTimelines.create(buildIncidentTimelinePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create incidentTimelines");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "incident_timelines", "create", `IncidentTimeline created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapIncidentTimelineSummary(created, maps);
    }

    async getBackupSchedulers(authUserId: string, email: string, fullName?: string | null): Promise<BackupSchedulerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copBackupSchedulers.listByOrganization(context.organizationId)).map((r) => mapBackupSchedulerSummary(r, maps));
    }

    async createBackupScheduler(authUserId: string, email: string, input: CreateBackupSchedulerInput, fullName?: string | null): Promise<BackupSchedulerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copBackupSchedulers.create(buildBackupSchedulerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create backupSchedulers");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "backup_schedulers", "create", `BackupScheduler created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBackupSchedulerSummary(created, maps);
    }

    async getRestoreValidations(authUserId: string, email: string, fullName?: string | null): Promise<RestoreValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copRestoreValidations.listByOrganization(context.organizationId)).map((r) => mapRestoreValidationSummary(r, maps));
    }

    async createRestoreValidation(authUserId: string, email: string, input: CreateRestoreValidationInput, fullName?: string | null): Promise<RestoreValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copRestoreValidations.create(buildRestoreValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create restoreValidations");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "restore_validations", "create", `RestoreValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRestoreValidationSummary(created, maps);
    }

    async getMaintenanceModes(authUserId: string, email: string, fullName?: string | null): Promise<MaintenanceModeSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copMaintenanceModes.listByOrganization(context.organizationId)).map((r) => mapMaintenanceModeSummary(r, maps));
    }

    async createMaintenanceMode(authUserId: string, email: string, input: CreateMaintenanceModeInput, fullName?: string | null): Promise<MaintenanceModeSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copMaintenanceModes.create(buildMaintenanceModePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create maintenanceModes");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "maintenance_modes", "create", `MaintenanceMode created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMaintenanceModeSummary(created, maps);
    }

    async getFeatureFlagOps(authUserId: string, email: string, fullName?: string | null): Promise<FeatureFlagOpSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copFeatureFlagOps.listByOrganization(context.organizationId)).map((r) => mapFeatureFlagOpSummary(r, maps));
    }

    async createFeatureFlagOp(authUserId: string, email: string, input: CreateFeatureFlagOpInput, fullName?: string | null): Promise<FeatureFlagOpSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copFeatureFlagOps.create(buildFeatureFlagOpPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create featureFlagOps");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "feature_flag_ops", "create", `FeatureFlagOp created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeatureFlagOpSummary(created, maps);
    }

    async getPlatformDiagnostics(authUserId: string, email: string, fullName?: string | null): Promise<PlatformDiagnosticSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copPlatformDiagnostics.listByOrganization(context.organizationId)).map((r) => mapPlatformDiagnosticSummary(r, maps));
    }

    async createPlatformDiagnostic(authUserId: string, email: string, input: CreatePlatformDiagnosticInput, fullName?: string | null): Promise<PlatformDiagnosticSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copPlatformDiagnostics.create(buildPlatformDiagnosticPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create platformDiagnostics");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "platform_diagnostics", "create", `PlatformDiagnostic created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPlatformDiagnosticSummary(created, maps);
    }

    async getBetaOrganizations(authUserId: string, email: string, fullName?: string | null): Promise<BetaOrganizationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copBetaOrganizations.listByOrganization(context.organizationId)).map((r) => mapBetaOrganizationSummary(r, maps));
    }

    async createBetaOrganization(authUserId: string, email: string, input: CreateBetaOrganizationInput, fullName?: string | null): Promise<BetaOrganizationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copBetaOrganizations.create(buildBetaOrganizationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create betaOrganizations");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "beta_organizations", "create", `BetaOrganization created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBetaOrganizationSummary(created, maps);
    }

    async getBetaInvitations(authUserId: string, email: string, fullName?: string | null): Promise<BetaInvitationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copBetaInvitations.listByOrganization(context.organizationId)).map((r) => mapBetaInvitationSummary(r, maps));
    }

    async createBetaInvitation(authUserId: string, email: string, input: CreateBetaInvitationInput, fullName?: string | null): Promise<BetaInvitationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copBetaInvitations.create(buildBetaInvitationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create betaInvitations");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "beta_invitations", "create", `BetaInvitation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBetaInvitationSummary(created, maps);
    }

    async getFeedbackCollections(authUserId: string, email: string, fullName?: string | null): Promise<FeedbackCollectionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copFeedbackCollection.listByOrganization(context.organizationId)).map((r) => mapFeedbackCollectionSummary(r, maps));
    }

    async createFeedbackCollection(authUserId: string, email: string, input: CreateFeedbackCollectionInput, fullName?: string | null): Promise<FeedbackCollectionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copFeedbackCollection.create(buildFeedbackCollectionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create feedbackCollection");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "feedback_collection", "create", `FeedbackCollection created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeedbackCollectionSummary(created, maps);
    }

    async getFeatureRequests(authUserId: string, email: string, fullName?: string | null): Promise<FeatureRequestSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copFeatureRequests.listByOrganization(context.organizationId)).map((r) => mapFeatureRequestSummary(r, maps));
    }

    async createFeatureRequest(authUserId: string, email: string, input: CreateFeatureRequestInput, fullName?: string | null): Promise<FeatureRequestSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copFeatureRequests.create(buildFeatureRequestPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create featureRequests");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "feature_requests", "create", `FeatureRequest created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFeatureRequestSummary(created, maps);
    }

    async getBugReports(authUserId: string, email: string, fullName?: string | null): Promise<BugReportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copBugReports.listByOrganization(context.organizationId)).map((r) => mapBugReportSummary(r, maps));
    }

    async createBugReport(authUserId: string, email: string, input: CreateBugReportInput, fullName?: string | null): Promise<BugReportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copBugReports.create(buildBugReportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create bugReports");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "bug_reports", "create", `BugReport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBugReportSummary(created, maps);
    }

    async getReleaseChannels(authUserId: string, email: string, fullName?: string | null): Promise<ReleaseChannelSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copReleaseChannels.listByOrganization(context.organizationId)).map((r) => mapReleaseChannelSummary(r, maps));
    }

    async createReleaseChannel(authUserId: string, email: string, input: CreateReleaseChannelInput, fullName?: string | null): Promise<ReleaseChannelSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copReleaseChannels.create(buildReleaseChannelPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create releaseChannels");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "release_channels", "create", `ReleaseChannel created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReleaseChannelSummary(created, maps);
    }

    async getOperatedMetrics(authUserId: string, email: string, fullName?: string | null): Promise<OperatedMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.copOperatedMetrics.listByOrganization(context.organizationId)).map(mapOperatedMetricSummary);
    }

    async createOperatedMetric(authUserId: string, email: string, input: CreateOperatedMetricInput, fullName?: string | null): Promise<OperatedMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copOperatedMetrics.create(buildOperatedMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operatedMetrics");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "operated_metrics", "create", `OperatedMetric created`, created.id));
        return mapOperatedMetricSummary(created);
    }

    async getOperatedHealths(authUserId: string, email: string, fullName?: string | null): Promise<OperatedHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.copOperatedHealth.listByOrganization(context.organizationId)).map(mapOperatedHealthSummary);
    }

    async createOperatedHealth(authUserId: string, email: string, input: CreateOperatedHealthInput, fullName?: string | null): Promise<OperatedHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copOperatedHealth.create(buildOperatedHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create operatedHealth");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "operated_health", "create", `OperatedHealth created`, created.id));
        return mapOperatedHealthSummary(created);
    }

    async getExecutiveBriefings(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveBriefingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copExecutiveBriefings.listByOrganization(context.organizationId)).map((r) => mapExecutiveBriefingSummary(r, maps));
    }

    async createExecutiveBriefing(authUserId: string, email: string, input: CreateExecutiveBriefingInput, fullName?: string | null): Promise<ExecutiveBriefingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copExecutiveBriefings.create(buildExecutiveBriefingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveBriefings");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "executive_briefings", "create", `ExecutiveBriefing created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveBriefingSummary(created, maps);
    }

    async getPlatformFailures(authUserId: string, email: string, fullName?: string | null): Promise<PlatformFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.copPlatformFailures.listByOrganization(context.organizationId)).map((r) => mapPlatformFailureSummary(r, maps));
    }

    async createPlatformFailure(authUserId: string, email: string, input: CreatePlatformFailureInput, fullName?: string | null): Promise<PlatformFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.copPlatformFailures.create(buildPlatformFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create platformFailures");
        await databaseService.copAuditLogs.create(buildCopAuditPayload(context.organizationId, "platform_failures", "create", `PlatformFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPlatformFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.copAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getOperatedHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.copOperatedHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkLaunchOnboarding(authUserId: string, email: string, input: CopSdkLaunchOnboardingInput, fullName?: string | null): Promise<CopSdkLaunchOnboardingResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createSignupFlow(authUserId, email, { operatedHubId: input.operatedHubId, flowKey: input.flowKey, flowName: input.flowName }, fullName);
        return { flowId: created.id, flowKey: created.flowKey, status: created.status };
    }

    async sdkDeployProduction(authUserId: string, email: string, input: CopSdkDeployProductionInput, fullName?: string | null): Promise<CopSdkDeployProductionResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createDeploymentJob(authUserId, email, { operatedHubId: input.operatedHubId, jobKey: input.jobKey, jobName: input.jobName }, fullName);
        return { jobId: created.id, jobKey: created.jobKey, status: created.status };
    }

    async sdkMonitorPlatform(authUserId: string, email: string, input: CopSdkMonitorPlatformInput, fullName?: string | null): Promise<CopSdkMonitorPlatformResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const launch = createLaunchFoundationClient(authUserId, email, fullName);
        await launch.getLaunchHubs();
        const company = createCompanyFoundationClient(authUserId, email, fullName);
        await company.getCompanyHubs();
        const csd = createCustomerSuccessDeliveryClient(authUserId, email, fullName);
        await csd.getDeliveryHubs();
        await crmService.getDeals(authUserId, email, fullName);
        const created = await this.createOnboardingWizard(authUserId, email, { operatedHubId: input.operatedHubId, wizardKey: input.wizardKey, wizardName: input.wizardName }, fullName);
        return { wizardId: created.id, wizardKey: created.wizardKey, status: created.status };
    }
}

export const customerOperatedPlatformService = new CustomerOperatedPlatformService();
