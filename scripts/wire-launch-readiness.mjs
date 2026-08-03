#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

// Wire data-access.ts
const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("ElrReadinessHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/executive-intelligence-repositories\";";
    const aixImportEnd = da.indexOf(anchor) + anchor.length;
    const elrImport = `
import {
    ElrReadinessHubRepository,
    ElrEnvironmentValidationRepository,
    ElrConfigurationValidationRepository,
    ElrSecretsValidationRepository,
    ElrDeploymentPlanRepository,
    ElrRollbackPlanRepository,
    ElrVersionRegistryRepository,
    ElrReleaseNoteRepository,
    ElrBackupPolicyRepository,
    ElrBackupVerificationRepository,
    ElrRestoreVerificationRepository,
    ElrRecoveryDrillRepository,
    ElrObservabilityLogRepository,
    ElrObservabilityMetricRepository,
    ElrTraceRecordRepository,
    ElrSlaMonitorRepository,
    ElrSecurityChecklistRepository,
    ElrVulnerabilityReviewRepository,
    ElrPermissionAuditRepository,
    ElrComplianceReviewRepository,
    ElrAdminGuideRepository,
    ElrUserGuideRepository,
    ElrDeploymentGuideRepository,
    ElrLaunchScoreMetricRepository,
    ElrReadinessValidationRepository,
    ElrLaunchBlockerRepository,
    ElrScoreSnapshotRepository,
    ElrLaunchHealthRepository,
    ElrCriticalIssueRepository,
    ElrReadinessWarningRepository,
    ElrLaunchFailureRepository,
    ElrAuditLogRepository,
} from "@/src/modules/database/repositories/launch-readiness-repositories";\n`;
    da = da.slice(0, aixImportEnd) + elrImport + da.slice(aixImportEnd);

    const aixProp = "    readonly aixAuditLogs: AixAuditLogRepository;";
    const elrProps = `    readonly elrReadinessHubs: ElrReadinessHubRepository;
    readonly elrEnvironmentValidations: ElrEnvironmentValidationRepository;
    readonly elrConfigurationValidations: ElrConfigurationValidationRepository;
    readonly elrSecretsValidations: ElrSecretsValidationRepository;
    readonly elrDeploymentPlans: ElrDeploymentPlanRepository;
    readonly elrRollbackPlans: ElrRollbackPlanRepository;
    readonly elrVersionRegistry: ElrVersionRegistryRepository;
    readonly elrReleaseNotes: ElrReleaseNoteRepository;
    readonly elrBackupPolicies: ElrBackupPolicyRepository;
    readonly elrBackupVerifications: ElrBackupVerificationRepository;
    readonly elrRestoreVerifications: ElrRestoreVerificationRepository;
    readonly elrRecoveryDrills: ElrRecoveryDrillRepository;
    readonly elrObservabilityLogs: ElrObservabilityLogRepository;
    readonly elrObservabilityMetrics: ElrObservabilityMetricRepository;
    readonly elrTraceRecords: ElrTraceRecordRepository;
    readonly elrSlaMonitors: ElrSlaMonitorRepository;
    readonly elrSecurityChecklists: ElrSecurityChecklistRepository;
    readonly elrVulnerabilityReviews: ElrVulnerabilityReviewRepository;
    readonly elrPermissionAudits: ElrPermissionAuditRepository;
    readonly elrComplianceReviews: ElrComplianceReviewRepository;
    readonly elrAdminGuides: ElrAdminGuideRepository;
    readonly elrUserGuides: ElrUserGuideRepository;
    readonly elrDeploymentGuides: ElrDeploymentGuideRepository;
    readonly elrLaunchScoreMetrics: ElrLaunchScoreMetricRepository;
    readonly elrReadinessValidations: ElrReadinessValidationRepository;
    readonly elrLaunchBlockers: ElrLaunchBlockerRepository;
    readonly elrScoreSnapshots: ElrScoreSnapshotRepository;
    readonly elrLaunchHealth: ElrLaunchHealthRepository;
    readonly elrCriticalIssues: ElrCriticalIssueRepository;
    readonly elrReadinessWarnings: ElrReadinessWarningRepository;
    readonly elrLaunchFailures: ElrLaunchFailureRepository;
    readonly elrAuditLogs: ElrAuditLogRepository;`;
    da = da.replace(aixProp, aixProp + "\n" + elrProps);

    const aixCtor = "        this.aixAuditLogs = new AixAuditLogRepository();";
    const elrCtor = `        this.elrReadinessHubs = new ElrReadinessHubRepository();
        this.elrEnvironmentValidations = new ElrEnvironmentValidationRepository();
        this.elrConfigurationValidations = new ElrConfigurationValidationRepository();
        this.elrSecretsValidations = new ElrSecretsValidationRepository();
        this.elrDeploymentPlans = new ElrDeploymentPlanRepository();
        this.elrRollbackPlans = new ElrRollbackPlanRepository();
        this.elrVersionRegistry = new ElrVersionRegistryRepository();
        this.elrReleaseNotes = new ElrReleaseNoteRepository();
        this.elrBackupPolicies = new ElrBackupPolicyRepository();
        this.elrBackupVerifications = new ElrBackupVerificationRepository();
        this.elrRestoreVerifications = new ElrRestoreVerificationRepository();
        this.elrRecoveryDrills = new ElrRecoveryDrillRepository();
        this.elrObservabilityLogs = new ElrObservabilityLogRepository();
        this.elrObservabilityMetrics = new ElrObservabilityMetricRepository();
        this.elrTraceRecords = new ElrTraceRecordRepository();
        this.elrSlaMonitors = new ElrSlaMonitorRepository();
        this.elrSecurityChecklists = new ElrSecurityChecklistRepository();
        this.elrVulnerabilityReviews = new ElrVulnerabilityReviewRepository();
        this.elrPermissionAudits = new ElrPermissionAuditRepository();
        this.elrComplianceReviews = new ElrComplianceReviewRepository();
        this.elrAdminGuides = new ElrAdminGuideRepository();
        this.elrUserGuides = new ElrUserGuideRepository();
        this.elrDeploymentGuides = new ElrDeploymentGuideRepository();
        this.elrLaunchScoreMetrics = new ElrLaunchScoreMetricRepository();
        this.elrReadinessValidations = new ElrReadinessValidationRepository();
        this.elrLaunchBlockers = new ElrLaunchBlockerRepository();
        this.elrScoreSnapshots = new ElrScoreSnapshotRepository();
        this.elrLaunchHealth = new ElrLaunchHealthRepository();
        this.elrCriticalIssues = new ElrCriticalIssueRepository();
        this.elrReadinessWarnings = new ElrReadinessWarningRepository();
        this.elrLaunchFailures = new ElrLaunchFailureRepository();
        this.elrAuditLogs = new ElrAuditLogRepository();`;
    da = da.replace(aixCtor, aixCtor + "\n" + elrCtor);

    writeFileSync(daPath, da, "utf8");
}

// Wire database-service.ts
const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("elrReadinessHubs")) {
    ds = ds.replace(
        "    aixAuditLogs: databaseAccess.aixAuditLogs,",
        `    aixAuditLogs: databaseAccess.aixAuditLogs,
    elrReadinessHubs: databaseAccess.elrReadinessHubs,
    elrEnvironmentValidations: databaseAccess.elrEnvironmentValidations,
    elrConfigurationValidations: databaseAccess.elrConfigurationValidations,
    elrSecretsValidations: databaseAccess.elrSecretsValidations,
    elrDeploymentPlans: databaseAccess.elrDeploymentPlans,
    elrRollbackPlans: databaseAccess.elrRollbackPlans,
    elrVersionRegistry: databaseAccess.elrVersionRegistry,
    elrReleaseNotes: databaseAccess.elrReleaseNotes,
    elrBackupPolicies: databaseAccess.elrBackupPolicies,
    elrBackupVerifications: databaseAccess.elrBackupVerifications,
    elrRestoreVerifications: databaseAccess.elrRestoreVerifications,
    elrRecoveryDrills: databaseAccess.elrRecoveryDrills,
    elrObservabilityLogs: databaseAccess.elrObservabilityLogs,
    elrObservabilityMetrics: databaseAccess.elrObservabilityMetrics,
    elrTraceRecords: databaseAccess.elrTraceRecords,
    elrSlaMonitors: databaseAccess.elrSlaMonitors,
    elrSecurityChecklists: databaseAccess.elrSecurityChecklists,
    elrVulnerabilityReviews: databaseAccess.elrVulnerabilityReviews,
    elrPermissionAudits: databaseAccess.elrPermissionAudits,
    elrComplianceReviews: databaseAccess.elrComplianceReviews,
    elrAdminGuides: databaseAccess.elrAdminGuides,
    elrUserGuides: databaseAccess.elrUserGuides,
    elrDeploymentGuides: databaseAccess.elrDeploymentGuides,
    elrLaunchScoreMetrics: databaseAccess.elrLaunchScoreMetrics,
    elrReadinessValidations: databaseAccess.elrReadinessValidations,
    elrLaunchBlockers: databaseAccess.elrLaunchBlockers,
    elrScoreSnapshots: databaseAccess.elrScoreSnapshots,
    elrLaunchHealth: databaseAccess.elrLaunchHealth,
    elrCriticalIssues: databaseAccess.elrCriticalIssues,
    elrReadinessWarnings: databaseAccess.elrReadinessWarnings,
    elrLaunchFailures: databaseAccess.elrLaunchFailures,
    elrAuditLogs: databaseAccess.elrAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for ELR");
