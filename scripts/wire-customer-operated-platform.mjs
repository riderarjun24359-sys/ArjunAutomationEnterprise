#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("CopOperatedHubRepository")) {
    const anchor = '} from "@/src/modules/database/repositories/customer-success-delivery-repositories";';
    const csdImportEnd = da.indexOf(anchor) + anchor.length;
    const copImport = `
import {
    CopOperatedHubRepository,
    CopSignupFlowRepository,
    CopOrgProvisioningRepository,
    CopDomainOnboardingRepository,
    CopEmailVerificationRepository,
    CopOnboardingWizardRepository,
    CopProductionProfileRepository,
    CopDeploymentJobRepository,
    CopHealthValidationRepository,
    CopRollbackAutomationRepository,
    CopDeploymentAuditRepository,
    CopCentralLogRepository,
    CopMetricsCollectorRepository,
    CopDistributedTraceRepository,
    CopAlertRuleRepository,
    CopIncidentTimelineRepository,
    CopBackupSchedulerRepository,
    CopRestoreValidationRepository,
    CopMaintenanceModeRepository,
    CopFeatureFlagOpRepository,
    CopPlatformDiagnosticRepository,
    CopBetaOrganizationRepository,
    CopBetaInvitationRepository,
    CopFeedbackCollectionRepository,
    CopFeatureRequestRepository,
    CopBugReportRepository,
    CopReleaseChannelRepository,
    CopOperatedMetricRepository,
    CopOperatedHealthRepository,
    CopExecutiveBriefingRepository,
    CopPlatformFailureRepository,
    CopAuditLogRepository,
}
from "@/src/modules/database/repositories/customer-operated-platform-repositories";
`;
    da = da.slice(0, csdImportEnd) + copImport + da.slice(csdImportEnd);

    const csdProp = "    readonly csdAuditLogs: CsdAuditLogRepository;";
    const copProps = `    readonly copOperatedHubs: CopOperatedHubRepository;
    readonly copSignupFlows: CopSignupFlowRepository;
    readonly copOrgProvisioning: CopOrgProvisioningRepository;
    readonly copDomainOnboarding: CopDomainOnboardingRepository;
    readonly copEmailVerifications: CopEmailVerificationRepository;
    readonly copOnboardingWizards: CopOnboardingWizardRepository;
    readonly copProductionProfiles: CopProductionProfileRepository;
    readonly copDeploymentJobs: CopDeploymentJobRepository;
    readonly copHealthValidations: CopHealthValidationRepository;
    readonly copRollbackAutomations: CopRollbackAutomationRepository;
    readonly copDeploymentAudits: CopDeploymentAuditRepository;
    readonly copCentralLogs: CopCentralLogRepository;
    readonly copMetricsCollectors: CopMetricsCollectorRepository;
    readonly copDistributedTraces: CopDistributedTraceRepository;
    readonly copAlertRules: CopAlertRuleRepository;
    readonly copIncidentTimelines: CopIncidentTimelineRepository;
    readonly copBackupSchedulers: CopBackupSchedulerRepository;
    readonly copRestoreValidations: CopRestoreValidationRepository;
    readonly copMaintenanceModes: CopMaintenanceModeRepository;
    readonly copFeatureFlagOps: CopFeatureFlagOpRepository;
    readonly copPlatformDiagnostics: CopPlatformDiagnosticRepository;
    readonly copBetaOrganizations: CopBetaOrganizationRepository;
    readonly copBetaInvitations: CopBetaInvitationRepository;
    readonly copFeedbackCollection: CopFeedbackCollectionRepository;
    readonly copFeatureRequests: CopFeatureRequestRepository;
    readonly copBugReports: CopBugReportRepository;
    readonly copReleaseChannels: CopReleaseChannelRepository;
    readonly copOperatedMetrics: CopOperatedMetricRepository;
    readonly copOperatedHealth: CopOperatedHealthRepository;
    readonly copExecutiveBriefings: CopExecutiveBriefingRepository;
    readonly copPlatformFailures: CopPlatformFailureRepository;
    readonly copAuditLogs: CopAuditLogRepository;`;
    da = da.replace(csdProp, csdProp + "\n" + copProps);

    const csdCtor = "        this.csdAuditLogs = new CsdAuditLogRepository();";
    const copCtor = `        this.copOperatedHubs = new CopOperatedHubRepository();
        this.copSignupFlows = new CopSignupFlowRepository();
        this.copOrgProvisioning = new CopOrgProvisioningRepository();
        this.copDomainOnboarding = new CopDomainOnboardingRepository();
        this.copEmailVerifications = new CopEmailVerificationRepository();
        this.copOnboardingWizards = new CopOnboardingWizardRepository();
        this.copProductionProfiles = new CopProductionProfileRepository();
        this.copDeploymentJobs = new CopDeploymentJobRepository();
        this.copHealthValidations = new CopHealthValidationRepository();
        this.copRollbackAutomations = new CopRollbackAutomationRepository();
        this.copDeploymentAudits = new CopDeploymentAuditRepository();
        this.copCentralLogs = new CopCentralLogRepository();
        this.copMetricsCollectors = new CopMetricsCollectorRepository();
        this.copDistributedTraces = new CopDistributedTraceRepository();
        this.copAlertRules = new CopAlertRuleRepository();
        this.copIncidentTimelines = new CopIncidentTimelineRepository();
        this.copBackupSchedulers = new CopBackupSchedulerRepository();
        this.copRestoreValidations = new CopRestoreValidationRepository();
        this.copMaintenanceModes = new CopMaintenanceModeRepository();
        this.copFeatureFlagOps = new CopFeatureFlagOpRepository();
        this.copPlatformDiagnostics = new CopPlatformDiagnosticRepository();
        this.copBetaOrganizations = new CopBetaOrganizationRepository();
        this.copBetaInvitations = new CopBetaInvitationRepository();
        this.copFeedbackCollection = new CopFeedbackCollectionRepository();
        this.copFeatureRequests = new CopFeatureRequestRepository();
        this.copBugReports = new CopBugReportRepository();
        this.copReleaseChannels = new CopReleaseChannelRepository();
        this.copOperatedMetrics = new CopOperatedMetricRepository();
        this.copOperatedHealth = new CopOperatedHealthRepository();
        this.copExecutiveBriefings = new CopExecutiveBriefingRepository();
        this.copPlatformFailures = new CopPlatformFailureRepository();
        this.copAuditLogs = new CopAuditLogRepository();`;
    da = da.replace(csdCtor, csdCtor + "\n" + copCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("copOperatedHubs")) {
    ds = ds.replace(
        "    csdAuditLogs: databaseAccess.csdAuditLogs,",
        `    csdAuditLogs: databaseAccess.csdAuditLogs,
    copOperatedHubs: databaseAccess.copOperatedHubs,
    copSignupFlows: databaseAccess.copSignupFlows,
    copOrgProvisioning: databaseAccess.copOrgProvisioning,
    copDomainOnboarding: databaseAccess.copDomainOnboarding,
    copEmailVerifications: databaseAccess.copEmailVerifications,
    copOnboardingWizards: databaseAccess.copOnboardingWizards,
    copProductionProfiles: databaseAccess.copProductionProfiles,
    copDeploymentJobs: databaseAccess.copDeploymentJobs,
    copHealthValidations: databaseAccess.copHealthValidations,
    copRollbackAutomations: databaseAccess.copRollbackAutomations,
    copDeploymentAudits: databaseAccess.copDeploymentAudits,
    copCentralLogs: databaseAccess.copCentralLogs,
    copMetricsCollectors: databaseAccess.copMetricsCollectors,
    copDistributedTraces: databaseAccess.copDistributedTraces,
    copAlertRules: databaseAccess.copAlertRules,
    copIncidentTimelines: databaseAccess.copIncidentTimelines,
    copBackupSchedulers: databaseAccess.copBackupSchedulers,
    copRestoreValidations: databaseAccess.copRestoreValidations,
    copMaintenanceModes: databaseAccess.copMaintenanceModes,
    copFeatureFlagOps: databaseAccess.copFeatureFlagOps,
    copPlatformDiagnostics: databaseAccess.copPlatformDiagnostics,
    copBetaOrganizations: databaseAccess.copBetaOrganizations,
    copBetaInvitations: databaseAccess.copBetaInvitations,
    copFeedbackCollection: databaseAccess.copFeedbackCollection,
    copFeatureRequests: databaseAccess.copFeatureRequests,
    copBugReports: databaseAccess.copBugReports,
    copReleaseChannels: databaseAccess.copReleaseChannels,
    copOperatedMetrics: databaseAccess.copOperatedMetrics,
    copOperatedHealth: databaseAccess.copOperatedHealth,
    copExecutiveBriefings: databaseAccess.copExecutiveBriefings,
    copPlatformFailures: databaseAccess.copPlatformFailures,
    copAuditLogs: databaseAccess.copAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for COP");
