#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-customer-success-delivery-ui.mjs");
const outPath = join(root, "scripts/generate-customer-operated-platform-ui.mjs");
let s = readFileSync(genPath, "utf8");

s = s.replace(/const mod = join\(root, "src\/modules\/customer-success-delivery"\);/, 'const mod = join(root, "src/modules/customer-operated-platform");');

const copEntitiesBlock = `const entities = [
    { tab: "operatedHubs", plural: "operatedHubs", singular: "OperatedHub", pascal: "OperatedHub", db: "copOperatedHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "signupFlows", plural: "signupFlows", singular: "SignupFlow", pascal: "SignupFlow", db: "copSignupFlows", fields: [{ name: "flowKey", type: "string" }, { name: "flowName", type: "string" }, { name: "flowStatus", type: "select", options: "FLOW_STATUS_OPTIONS" }], display: { title: "flowName", sub: "flowStatus" } },
    { tab: "orgProvisioning", plural: "orgProvisioning", singular: "OrgProvisioning", pascal: "OrgProvisioning", db: "copOrgProvisioning", fields: [{ name: "provisionKey", type: "string" }, { name: "provisionName", type: "string" }, { name: "provisionStatus", type: "select", options: "PROVISION_STATUS_OPTIONS" }], display: { title: "provisionName", sub: "provisionStatus" } },
    { tab: "domainOnboarding", plural: "domainOnboarding", singular: "DomainOnboarding", pascal: "DomainOnboarding", db: "copDomainOnboarding", fields: [{ name: "domainKey", type: "string" }, { name: "domainName", type: "string" }, { name: "domainStatus", type: "select", options: "DOMAIN_STATUS_OPTIONS" }], display: { title: "domainName", sub: "domainStatus" } },
    { tab: "emailVerifications", plural: "emailVerifications", singular: "EmailVerification", pascal: "EmailVerification", db: "copEmailVerifications", fields: [{ name: "verificationKey", type: "string" }, { name: "emailAddress", type: "string" }, { name: "verificationStatus", type: "select", options: "VERIFICATION_STATUS_OPTIONS" }], display: { title: "emailAddress", sub: "verificationStatus" } },
    { tab: "onboardingWizards", plural: "onboardingWizards", singular: "OnboardingWizard", pascal: "OnboardingWizard", db: "copOnboardingWizards", fields: [{ name: "wizardKey", type: "string" }, { name: "wizardName", type: "string" }, { name: "wizardStatus", type: "select", options: "WIZARD_STATUS_OPTIONS" }], display: { title: "wizardName", sub: "wizardStatus" } },
    { tab: "productionProfiles", plural: "productionProfiles", singular: "ProductionProfile", pascal: "ProductionProfile", db: "copProductionProfiles", fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileStatus", type: "select", options: "PROFILE_STATUS_OPTIONS" }], display: { title: "profileName", sub: "profileStatus" } },
    { tab: "deploymentJobs", plural: "deploymentJobs", singular: "DeploymentJob", pascal: "DeploymentJob", db: "copDeploymentJobs", fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "jobName", sub: "jobStatus" } },
    { tab: "healthValidations", plural: "healthValidations", singular: "HealthValidation", pascal: "HealthValidation", db: "copHealthValidations", fields: [{ name: "validationKey", type: "string" }, { name: "validationName", type: "string" }, { name: "validationStatus", type: "select", options: "VALIDATION_STATUS_OPTIONS" }], display: { title: "validationName", sub: "validationStatus" } },
    { tab: "rollbackAutomations", plural: "rollbackAutomations", singular: "RollbackAutomation", pascal: "RollbackAutomation", db: "copRollbackAutomations", fields: [{ name: "rollbackKey", type: "string" }, { name: "rollbackName", type: "string" }, { name: "rollbackStatus", type: "select", options: "ROLLBACK_STATUS_OPTIONS" }], display: { title: "rollbackName", sub: "rollbackStatus" } },
    { tab: "deploymentAudits", plural: "deploymentAudits", singular: "DeploymentAudit", pascal: "DeploymentAudit", db: "copDeploymentAudits", fields: [{ name: "auditKey", type: "string" }, { name: "auditName", type: "string" }, { name: "auditStatus", type: "select", options: "AUDIT_STATUS_OPTIONS" }], display: { title: "auditName", sub: "auditStatus" } },
    { tab: "centralLogs", plural: "centralLogs", singular: "CentralLog", pascal: "CentralLog", db: "copCentralLogs", fields: [{ name: "logKey", type: "string" }, { name: "logSource", type: "string" }, { name: "logLevel", type: "string" }], display: { title: "logSource", sub: "logLevel" } },
    { tab: "metricsCollectors", plural: "metricsCollectors", singular: "MetricsCollector", pascal: "MetricsCollector", db: "copMetricsCollectors", fields: [{ name: "collectorKey", type: "string" }, { name: "collectorName", type: "string" }, { name: "collectorStatus", type: "select", options: "COLLECTOR_STATUS_OPTIONS" }], display: { title: "collectorName", sub: "collectorStatus" } },
    { tab: "distributedTraces", plural: "distributedTraces", singular: "DistributedTrace", pascal: "DistributedTrace", db: "copDistributedTraces", fields: [{ name: "traceKey", type: "string" }, { name: "traceName", type: "string" }, { name: "traceStatus", type: "select", options: "TRACE_STATUS_OPTIONS" }], display: { title: "traceName", sub: "traceStatus" } },
    { tab: "alertRules", plural: "alertRules", singular: "AlertRule", pascal: "AlertRule", db: "copAlertRules", fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "severity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "ruleName", sub: "severity" } },
    { tab: "incidentTimelines", plural: "incidentTimelines", singular: "IncidentTimeline", pascal: "IncidentTimeline", db: "copIncidentTimelines", fields: [{ name: "incidentKey", type: "string" }, { name: "incidentTitle", type: "string" }, { name: "incidentStatus", type: "select", options: "INCIDENT_STATUS_OPTIONS" }], display: { title: "incidentTitle", sub: "incidentStatus" } },
    { tab: "backupSchedulers", plural: "backupSchedulers", singular: "BackupScheduler", pascal: "BackupScheduler", db: "copBackupSchedulers", fields: [{ name: "scheduleKey", type: "string" }, { name: "scheduleName", type: "string" }, { name: "scheduleStatus", type: "select", options: "SCHEDULE_STATUS_OPTIONS" }], display: { title: "scheduleName", sub: "scheduleStatus" } },
    { tab: "restoreValidations", plural: "restoreValidations", singular: "RestoreValidation", pascal: "RestoreValidation", db: "copRestoreValidations", fields: [{ name: "restoreKey", type: "string" }, { name: "restoreName", type: "string" }, { name: "restoreStatus", type: "select", options: "RESTORE_STATUS_OPTIONS" }], display: { title: "restoreName", sub: "restoreStatus" } },
    { tab: "maintenanceModes", plural: "maintenanceModes", singular: "MaintenanceMode", pascal: "MaintenanceMode", db: "copMaintenanceModes", fields: [{ name: "maintenanceKey", type: "string" }, { name: "maintenanceName", type: "string" }, { name: "maintenanceStatus", type: "select", options: "MAINTENANCE_STATUS_OPTIONS" }], display: { title: "maintenanceName", sub: "maintenanceStatus" } },
    { tab: "featureFlagOps", plural: "featureFlagOps", singular: "FeatureFlagOp", pascal: "FeatureFlagOp", db: "copFeatureFlagOps", fields: [{ name: "flagKey", type: "string" }, { name: "flagName", type: "string" }, { name: "flagStatus", type: "select", options: "FLAG_STATUS_OPTIONS" }], display: { title: "flagName", sub: "flagStatus" } },
    { tab: "platformDiagnostics", plural: "platformDiagnostics", singular: "PlatformDiagnostic", pascal: "PlatformDiagnostic", db: "copPlatformDiagnostics", fields: [{ name: "diagnosticKey", type: "string" }, { name: "diagnosticName", type: "string" }, { name: "diagnosticStatus", type: "select", options: "DIAGNOSTIC_STATUS_OPTIONS" }], display: { title: "diagnosticName", sub: "diagnosticStatus" } },
    { tab: "betaOrganizations", plural: "betaOrganizations", singular: "BetaOrganization", pascal: "BetaOrganization", db: "copBetaOrganizations", fields: [{ name: "orgKey", type: "string" }, { name: "orgName", type: "string" }, { name: "betaStatus", type: "select", options: "BETA_STATUS_OPTIONS" }], display: { title: "orgName", sub: "betaStatus" } },
    { tab: "betaInvitations", plural: "betaInvitations", singular: "BetaInvitation", pascal: "BetaInvitation", db: "copBetaInvitations", fields: [{ name: "invitationKey", type: "string" }, { name: "inviteeEmail", type: "string" }, { name: "invitationStatus", type: "select", options: "INVITATION_STATUS_OPTIONS" }], display: { title: "inviteeEmail", sub: "invitationStatus" } },
    { tab: "feedbackCollection", plural: "feedbackCollection", singular: "FeedbackCollection", pascal: "FeedbackCollection", db: "copFeedbackCollection", fields: [{ name: "feedbackKey", type: "string" }, { name: "feedbackTitle", type: "string" }, { name: "feedbackType", type: "string" }], display: { title: "feedbackTitle", sub: "feedbackType" } },
    { tab: "featureRequests", plural: "featureRequests", singular: "FeatureRequest", pascal: "FeatureRequest", db: "copFeatureRequests", fields: [{ name: "requestKey", type: "string" }, { name: "requestTitle", type: "string" }, { name: "requestStatus", type: "select", options: "REQUEST_STATUS_OPTIONS" }], display: { title: "requestTitle", sub: "requestStatus" } },
    { tab: "bugReports", plural: "bugReports", singular: "BugReport", pascal: "BugReport", db: "copBugReports", fields: [{ name: "bugKey", type: "string" }, { name: "bugTitle", type: "string" }, { name: "bugStatus", type: "select", options: "BUG_STATUS_OPTIONS" }], display: { title: "bugTitle", sub: "bugStatus" } },
    { tab: "releaseChannels", plural: "releaseChannels", singular: "ReleaseChannel", pascal: "ReleaseChannel", db: "copReleaseChannels", fields: [{ name: "channelKey", type: "string" }, { name: "channelName", type: "string" }, { name: "channelStatus", type: "select", options: "CHANNEL_STATUS_OPTIONS" }], display: { title: "channelName", sub: "channelStatus" } },
    { tab: "operatedMetrics", plural: "operatedMetrics", singular: "OperatedMetric", pascal: "OperatedMetric", db: "copOperatedMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "productionStatusScore", type: "number" }, { name: "overallOperatedScore", type: "number" }], display: { title: "metricsKey", sub: "overallOperatedScore" } },
    { tab: "operatedHealth", plural: "operatedHealth", singular: "OperatedHealth", pascal: "OperatedHealth", db: "copOperatedHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "executiveBriefings", plural: "executiveBriefings", singular: "ExecutiveBriefing", pascal: "ExecutiveBriefing", db: "copExecutiveBriefings", fields: [{ name: "briefingKey", type: "string" }, { name: "briefingTitle", type: "string" }, { name: "briefingType", type: "string" }], display: { title: "briefingTitle", sub: "briefingType" } },
    { tab: "platformFailures", plural: "platformFailures", singular: "PlatformFailure", pascal: "PlatformFailure", db: "copPlatformFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const entities = \[[\s\S]*?\];/, copEntitiesBlock);

const reps = [
    [/deliveryHubs/g, "operatedHubs"],
    [/deliveryHubOptions/g, "operatedHubOptions"],
    [/getDeliveryHubs/g, "getOperatedHubs"],
    [/getDeliveryHubOptions/g, "getOperatedHubOptions"],
    [/DeliveryHubSelect/g, "OperatedHubSelect"],
    [/buildDeliveryHubLookupMaps/g, "buildOperatedHubLookupMaps"],
    [/deliveryHubId/g, "operatedHubId"],
    [/Delivery Hubs/g, "Operated Hubs"],
    [/Customer Success & Delivery/g, "Customer Operated Platform"],
    [/delivery hub/g, "operated hub"],
    [/DeliveryHub/g, "OperatedHub"],
    [/OperationsMetric/g, "OperatedMetric"],
    [/OperationsHealth/g, "OperatedHealth"],
    [/DeliveryFailure/g, "PlatformFailure"],
    [/CustomerSuccessDeliveryPage/g, "CustomerOperatedPlatformPage"],
    [/CustomerSuccessDeliveryStats/g, "CustomerOperatedPlatformStats"],
    [/CustomerSuccessDeliveryPanels/g, "CustomerOperatedPlatformPanels"],
    [/CustomerSuccessDeliveryService/g, "CustomerOperatedPlatformService"],
    [/CustomerSuccessDeliveryClient/g, "CustomerOperatedPlatformClient"],
    [/buildCsd/g, "buildCop"],
    [/mapCsd/g, "mapCop"],
    [/CsdDashboardStats/g, "CopDashboardStats"],
    [/CsdPipelineInfo/g, "CopPipelineInfo"],
    [/CsdSdk/g, "CopSdk"],
    [/CSD_TABS/g, "COP_TABS"],
    [/CSD_THEME/g, "COP_THEME"],
    [/CSD_PERMISSIONS/g, "COP_PERMISSIONS"],
    [/CSD_STATUS_OPTIONS/g, "COP_STATUS_OPTIONS"],
    [/Program F Wave 3/g, "Launch Ready to Customer Operated"],
    [/sky-600/g, "violet-600"],
    [/sky-500/g, "violet-500"],
    [/sky-400/g, "violet-400"],
    [/sky-300/g, "violet-300"],
    [/ring-sky/g, "ring-violet"],
    [/bg-sky/g, "bg-violet"],
    [/text-sky/g, "text-violet"],
    [/hover:bg-sky/g, "hover:bg-violet"],
    [/hover:border-sky/g, "hover:border-violet"],
    [/mapCustomerHealthScoreForStats/g, "mapSignupFlowForStats"],
    [/mapSupportTicketForStats/g, "mapDeploymentJobForStats"],
    [/mapOperationsMetricForStats/g, "mapOperatedMetricForStats"],
    [/mapDeploymentTrackingForStats/g, "mapProductionProfileForStats"],
    [/mapTrainingPortalForStats/g, "mapCentralLogForStats"],
    [/mapOperationsHealthForStats/g, "mapOperatedHealthForStats"],
    [/mapDeliveryFailureForStats/g, "mapPlatformFailureForStats"],
    [/customerHealthScores/g, "signupFlows"],
    [/supportTickets/g, "deploymentJobs"],
    [/deploymentTracking/g, "productionProfiles"],
    [/trainingPortals/g, "centralLogs"],
    [/deliveryWorkflows/g, "onboardingWizards"],
    [/operationsMetrics/g, "operatedMetrics"],
    [/operationsHealth/g, "operatedHealth"],
    [/deliveryFailures/g, "platformFailures"],
    [/totalDeliveryHubs/g, "totalOperatedHubs"],
    [/activeDeliveryHubs/g, "activeOperatedHubs"],
    [/customerHealthScoreCount/g, "signupFlowCount"],
    [/supportTicketCount/g, "deploymentJobCount"],
    [/deploymentTrackingCount/g, "productionProfileCount"],
    [/trainingPortalCount/g, "centralLogCount"],
    [/deliveryWorkflowCount/g, "onboardingWizardCount"],
    [/openDeliveryFailureCount/g, "openPlatformFailureCount"],
    [/overallDeliveryScore/g, "overallOperatedScore"],
    [/adoptionRateScore/g, "onboardingCompletionRate"],
    [/renewalForecastCount/g, "activeIncidentCount"],
    [/openTicketCount/g, "pendingApprovalCount"],
    [/slaComplianceScore/g, "platformAvailabilityScore"],
    [/deploymentStatusScore/g, "productionStatusScore"],
    [/liveChatSessionCount/g, "revenueToday"],
    [/sdkTrackCustomerHealth/g, "sdkLaunchOnboarding"],
    [/sdkOpenSupportTicket/g, "sdkDeployProduction"],
    [/sdkRunDeliveryWorkflow/g, "sdkMonitorPlatform"],
    [/trackCustomerHealth/g, "launchOnboarding"],
    [/openSupportTicket/g, "deployProduction"],
    [/runDeliveryWorkflow/g, "monitorPlatform"],
    [/createCustomerHealthScore/g, "createSignupFlow"],
    [/createSupportTicket/g, "createDeploymentJob"],
    [/createDeliveryWorkflow/g, "createOnboardingWizard"],
    [/Track customer health/g, "Launch onboarding flow"],
    [/Open support ticket/g, "Deploy production job"],
    [/Run delivery workflow/g, "Monitor platform health"],
    [/customer health scores, support tickets, deployment tracking, training portals, delivery workflows, and operations metrics/g, "signup flows, deployment jobs, production profiles, central logs, onboarding wizards, and operated metrics"],
    [/Customer health scores, support tickets, deployment tracking, training portals, delivery workflows, operations metrics, and customer success delivery outputs/g, "Signup flows, deployment jobs, production profiles, central logs, onboarding wizards, operated metrics, and customer operated platform outputs"],
    [/customer_success_delivery/g, "customer_operated_platform"],
    [/track_customer_health/g, "launch_onboarding"],
    [/run_delivery_workflow/g, "monitor_platform"],
    [/"csd\.view"/g, '"cop.view"'],
    [/"csd\.manage"/g, '"cop.manage"'],
    [/"csd\.approve"/g, '"cop.approve"'],
    [/"csd\.admin"/g, '"cop.admin"'],
    [/csdDeliveryHubs/g, "copOperatedHubs"],
    [/getDeliveryFailures/g, "getPlatformFailures"],
    [/customer-success-delivery-mappers/g, "customer-operated-platform-mappers"],
    [/buildDeliveryHubPayload/g, "buildOperatedHubPayload"],
    [/mapDeliveryHubSummary/g, "mapOperatedHubSummary"],
    [/buildCsdAuditPayload/g, "buildCopAuditPayload"],
    [/createCustomerSuccessDeliveryClient/g, "createCustomerOperatedPlatformClient"],
    [/databaseService\.csd/g, "databaseService.cop"],
    [/useCustomerSuccessDelivery/g, "useCustomerOperatedPlatform"],
    [/customerSuccessDeliveryService/g, "customerOperatedPlatformService"],
    [/customer-success-delivery\.service/g, "customer-operated-platform.service"],
    [/@\/src\/modules\/customer-success-delivery\//g, "@/src/modules/customer-operated-platform/"],
    [/\/customer-success-delivery\/page/g, "/customer-operated-platform/page"],
    [/app\/\(shell\)\/customer-success-delivery/g, "app/(shell)/customer-operated-platform"],
    [/CsdSdkTrackCustomerHealthInput/g, "CopSdkLaunchOnboardingInput"],
    [/CsdSdkTrackCustomerHealthResult/g, "CopSdkLaunchOnboardingResult"],
    [/CsdSdkOpenSupportTicketInput/g, "CopSdkDeployProductionInput"],
    [/CsdSdkOpenSupportTicketResult/g, "CopSdkDeployProductionResult"],
    [/CsdSdkRunDeliveryWorkflowInput/g, "CopSdkMonitorPlatformInput"],
    [/CsdSdkRunDeliveryWorkflowResult/g, "CopSdkMonitorPlatformResult"],
    [/customer-success-delivery/g, "customer-operated-platform"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(
    /import { createCompanyFoundationClient } from "@\/src\/modules\/company-foundation\/sdk";\r?\nimport { crmService } from "@\/src\/modules\/crm\/services\/crm\.service";/,
    `import { createCompanyFoundationClient } from "@/src/modules/company-foundation/sdk";
import { createCustomerSuccessDeliveryClient } from "@/src/modules/customer-success-delivery/sdk";
import { crmService } from "@/src/modules/crm/services/crm.service";`,
);

s = s.replace(
    /async getDashboardStats\(authUserId: string, email: string, fullName\?: string \| null\): Promise<CopDashboardStats> \{[\s\S]*?getPipelineInfo\(\): CopPipelineInfo/,
    `async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CopDashboardStats> {
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

    getPipelineInfo(): CopPipelineInfo`,
);

s = s.replace(
    /async sdkLaunchOnboarding\(authUserId: string, email: string, input: CopSdk[\s\S]*?return \{ scoreId: created\.id, scoreKey: created\.scoreKey, status: created\.status \};\r?\n    \}/,
    `async sdkLaunchOnboarding(authUserId: string, email: string, input: CopSdkLaunchOnboardingInput, fullName?: string | null): Promise<CopSdkLaunchOnboardingResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getIndustryFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormEngineHubs();
        await crmService.getClients(authUserId, email, fullName);
        const created = await this.createSignupFlow(authUserId, email, { operatedHubId: input.operatedHubId, flowKey: input.flowKey, flowName: input.flowName }, fullName);
        return { flowId: created.id, flowKey: created.flowKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkDeployProduction\(authUserId: string, email: string, input: CopSdk[\s\S]*?return \{ ticketId: created\.id, ticketKey: created\.ticketKey, status: created\.status \};\r?\n    \}/,
    `async sdkDeployProduction(authUserId: string, email: string, input: CopSdkDeployProductionInput, fullName?: string | null): Promise<CopSdkDeployProductionResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowEngineHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const created = await this.createDeploymentJob(authUserId, email, { operatedHubId: input.operatedHubId, jobKey: input.jobKey, jobName: input.jobName }, fullName);
        return { jobId: created.id, jobKey: created.jobKey, status: created.status };
    }`,
);

s = s.replace(
    /async sdkMonitorPlatform\(authUserId: string, email: string, input: CopSdk[\s\S]*?return \{ workflowId: created\.id, workflowKey: created\.workflowKey, status: created\.status \};\r?\n    \}/,
    `async sdkMonitorPlatform(authUserId: string, email: string, input: CopSdkMonitorPlatformInput, fullName?: string | null): Promise<CopSdkMonitorPlatformResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getBusinessProcessHubs();
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
    }`,
);

const copOptionsBlock = `export const FLOW_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
] as const;

export const PROVISION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const DOMAIN_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "failed", label: "Failed" },
] as const;

export const VERIFICATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "expired", label: "Expired" },
] as const;

export const WIZARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
] as const;

export const PROFILE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const JOB_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const VALIDATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const ROLLBACK_STATUS_OPTIONS = [
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const AUDIT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const COLLECTOR_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "failed", label: "Failed" },
] as const;

export const TRACE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
] as const;

export const INCIDENT_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "investigating", label: "Investigating" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const SCHEDULE_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "disabled", label: "Disabled" },
] as const;

export const RESTORE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "validated", label: "Validated" },
    { value: "failed", label: "Failed" },
] as const;

export const MAINTENANCE_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
] as const;

export const FLAG_STATUS_OPTIONS = [
    { value: "enabled", label: "Enabled" },
    { value: "disabled", label: "Disabled" },
    { value: "rollout", label: "Rollout" },
] as const;

export const DIAGNOSTIC_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "passed", label: "Passed" },
    { value: "failed", label: "Failed" },
] as const;

export const BETA_STATUS_OPTIONS = [
    { value: "invited", label: "Invited" },
    { value: "active", label: "Active" },
    { value: "graduated", label: "Graduated" },
    { value: "churned", label: "Churned" },
] as const;

export const INVITATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "expired", label: "Expired" },
] as const;

export const REQUEST_STATUS_OPTIONS = [
    { value: "submitted", label: "Submitted" },
    { value: "reviewing", label: "Reviewing" },
    { value: "approved", label: "Approved" },
    { value: "declined", label: "Declined" },
] as const;

export const BUG_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
] as const;

export const CHANNEL_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const COP_PERMISSIONS = ["cop.view", "cop.manage", "cop.approve", "cop.admin"] as const;

export const COP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
    { value: "running", label: "Running" },
    { value: "pending", label: "Pending" },
    { value: "deployed", label: "Deployed" },
    { value: "completed", label: "Completed" },
] as const;

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const COP_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const COP_THEME)/,
    `$1${copOptionsBlock}$2`,
);

s = s.replace(/Select delivery hub/g, "Select operated hub");
s = s.replace(/PLAN_STATUS_OPTIONS/g, "FLOW_STATUS_OPTIONS");
s = s.replace(/SESSION_STATUS_OPTIONS/g, "PROVISION_STATUS_OPTIONS");
s = s.replace(/WORKFLOW_STATUS_OPTIONS/g, "WIZARD_STATUS_OPTIONS");
s = s.replace(/IMPLEMENTATION_STATUS_OPTIONS/g, "VALIDATION_STATUS_OPTIONS");
s = s.replace(/UPGRADE_STATUS_OPTIONS/g, "ROLLBACK_STATUS_OPTIONS");
s = s.replace(/MILESTONE_STATUS_OPTIONS/g, "INCIDENT_STATUS_OPTIONS");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-customer-operated-platform-ui.mjs");
