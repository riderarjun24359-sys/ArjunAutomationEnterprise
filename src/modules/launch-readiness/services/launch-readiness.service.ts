import {
    buildReadinessHubLookupMaps,
    buildElrAuditPayload,
    buildElrDashboardStats,
    buildElrPipelineInfo,
    mapAuditEntry,
    buildReadinessHubPayload,
    mapReadinessHubSummary,
    buildEnvironmentValidationPayload,
    mapEnvironmentValidationSummary,
    buildConfigurationValidationPayload,
    mapConfigurationValidationSummary,
    buildSecretsValidationPayload,
    mapSecretsValidationSummary,
    buildDeploymentPlanPayload,
    mapDeploymentPlanSummary,
    buildRollbackPlanPayload,
    mapRollbackPlanSummary,
    buildVersionRegistryPayload,
    mapVersionRegistrySummary,
    buildReleaseNotePayload,
    mapReleaseNoteSummary,
    buildBackupPolicyPayload,
    mapBackupPolicySummary,
    buildBackupVerificationPayload,
    mapBackupVerificationSummary,
    buildRestoreVerificationPayload,
    mapRestoreVerificationSummary,
    buildRecoveryDrillPayload,
    mapRecoveryDrillSummary,
    buildObservabilityLogPayload,
    mapObservabilityLogSummary,
    buildObservabilityMetricPayload,
    mapObservabilityMetricSummary,
    buildTraceRecordPayload,
    mapTraceRecordSummary,
    buildSlaMonitorPayload,
    mapSlaMonitorSummary,
    buildSecurityChecklistPayload,
    mapSecurityChecklistSummary,
    buildVulnerabilityReviewPayload,
    mapVulnerabilityReviewSummary,
    buildPermissionAuditPayload,
    mapPermissionAuditSummary,
    buildComplianceReviewPayload,
    mapComplianceReviewSummary,
    buildAdminGuidePayload,
    mapAdminGuideSummary,
    buildUserGuidePayload,
    mapUserGuideSummary,
    buildDeploymentGuidePayload,
    mapDeploymentGuideSummary,
    buildLaunchScoreMetricPayload,
    mapLaunchScoreMetricSummary,
    buildReadinessValidationPayload,
    mapReadinessValidationSummary,
    buildLaunchBlockerPayload,
    mapLaunchBlockerSummary,
    buildScoreSnapshotPayload,
    mapScoreSnapshotSummary,
    buildLaunchHealthPayload,
    mapLaunchHealthSummary,
    buildCriticalIssuePayload,
    mapCriticalIssueSummary,
    buildReadinessWarningPayload,
    mapReadinessWarningSummary,
    buildLaunchFailurePayload,
    mapLaunchFailureSummary,
    mapDeploymentPlanForStats,
    mapBackupPolicyForStats,
    mapLaunchScoreMetricForStats,
    mapRecoveryDrillForStats,
    mapLaunchBlockerForStats,
    mapReadinessValidationForStats,
    mapLaunchHealthForStats,
    mapLaunchFailureForStats,
} from "@/src/modules/database/lib/launch-readiness-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ReadinessHubSummary,
    CreateReadinessHubInput,
    EnvironmentValidationSummary,
    CreateEnvironmentValidationInput,
    ConfigurationValidationSummary,
    CreateConfigurationValidationInput,
    SecretsValidationSummary,
    CreateSecretsValidationInput,
    DeploymentPlanSummary,
    CreateDeploymentPlanInput,
    RollbackPlanSummary,
    CreateRollbackPlanInput,
    VersionRegistrySummary,
    CreateVersionRegistryInput,
    ReleaseNoteSummary,
    CreateReleaseNoteInput,
    BackupPolicySummary,
    CreateBackupPolicyInput,
    BackupVerificationSummary,
    CreateBackupVerificationInput,
    RestoreVerificationSummary,
    CreateRestoreVerificationInput,
    RecoveryDrillSummary,
    CreateRecoveryDrillInput,
    ObservabilityLogSummary,
    CreateObservabilityLogInput,
    ObservabilityMetricSummary,
    CreateObservabilityMetricInput,
    TraceRecordSummary,
    CreateTraceRecordInput,
    SlaMonitorSummary,
    CreateSlaMonitorInput,
    SecurityChecklistSummary,
    CreateSecurityChecklistInput,
    VulnerabilityReviewSummary,
    CreateVulnerabilityReviewInput,
    PermissionAuditSummary,
    CreatePermissionAuditInput,
    ComplianceReviewSummary,
    CreateComplianceReviewInput,
    AdminGuideSummary,
    CreateAdminGuideInput,
    UserGuideSummary,
    CreateUserGuideInput,
    DeploymentGuideSummary,
    CreateDeploymentGuideInput,
    LaunchScoreMetricSummary,
    CreateLaunchScoreMetricInput,
    ReadinessValidationSummary,
    CreateReadinessValidationInput,
    LaunchBlockerSummary,
    CreateLaunchBlockerInput,
    ScoreSnapshotSummary,
    CreateScoreSnapshotInput,
    LaunchHealthSummary,
    CreateLaunchHealthInput,
    CriticalIssueSummary,
    CreateCriticalIssueInput,
    ReadinessWarningSummary,
    CreateReadinessWarningInput,
    LaunchFailureSummary,
    CreateLaunchFailureInput,
    AuditEntry,
    ElrDashboardStats,
    ElrPipelineInfo,
    ElrSdkValidateEnvironmentInput,
    ElrSdkValidateEnvironmentResult,
    ElrSdkRunDeploymentCheckInput,
    ElrSdkRunDeploymentCheckResult,
    ElrSdkRunRecoveryDrillInput,
    ElrSdkRunRecoveryDrillResult,
} from "@/src/modules/launch-readiness/types";

export class LaunchReadinessService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const readinessHubs = await databaseService.elrReadinessHubs.listByOrganization(organizationId);
        return buildReadinessHubLookupMaps(readinessHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<ElrDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildElrDashboardStats({ readinessHubs: [], deploymentPlans: [], backupPolicies: [], launchScoreMetrics: [], recoveryDrills: [], launchBlockers: [], readinessValidations: [], launchHealth: [], launchFailures: [], auditLogs: [] });
        const [readinessHubs, deploymentPlansRaw, backupPoliciesRaw, launchScoreMetricsRaw, recoveryDrillsRaw, launchBlockersRaw, readinessValidationsRaw, launchHealthRaw, launchFailures, auditLogs] = await Promise.all([
            this.getReadinessHubs(authUserId, email, fullName),
            databaseService.elrDeploymentPlans.listByOrganization(context.organizationId),
            databaseService.elrBackupPolicies.listByOrganization(context.organizationId),
            databaseService.elrLaunchScoreMetrics.listByOrganization(context.organizationId),
            databaseService.elrRecoveryDrills.listByOrganization(context.organizationId),
            databaseService.elrLaunchBlockers.listByOrganization(context.organizationId),
            databaseService.elrReadinessValidations.listByOrganization(context.organizationId),
            databaseService.elrLaunchHealth.listByOrganization(context.organizationId),
            this.getLaunchFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildElrDashboardStats({
            readinessHubs,
            deploymentPlans: deploymentPlansRaw.map(mapDeploymentPlanForStats),
            backupPolicies: backupPoliciesRaw.map(mapBackupPolicyForStats),
            launchScoreMetrics: launchScoreMetricsRaw.map(mapLaunchScoreMetricForStats),
            recoveryDrills: recoveryDrillsRaw.map(mapRecoveryDrillForStats),
            launchBlockers: launchBlockersRaw.map(mapLaunchBlockerForStats),
            readinessValidations: readinessValidationsRaw.map(mapReadinessValidationForStats),
            launchHealth: launchHealthRaw.map(mapLaunchHealthForStats),
            launchFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): ElrPipelineInfo {
        return buildElrPipelineInfo();
    }

    async getReadinessHubs(authUserId: string, email: string, fullName?: string | null): Promise<ReadinessHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elrReadinessHubs.listByOrganization(context.organizationId)).map((r) => mapReadinessHubSummary(r));
    }

    async createReadinessHub(authUserId: string, email: string, input: CreateReadinessHubInput, fullName?: string | null): Promise<ReadinessHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrReadinessHubs.create(buildReadinessHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create readinessHubs");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "readiness_hubs", "create", `ReadinessHub created`, created.id));
        return mapReadinessHubSummary(created);
    }

    async getEnvironmentValidations(authUserId: string, email: string, fullName?: string | null): Promise<EnvironmentValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrEnvironmentValidations.listByOrganization(context.organizationId)).map((r) => mapEnvironmentValidationSummary(r, maps));
    }

    async createEnvironmentValidation(authUserId: string, email: string, input: CreateEnvironmentValidationInput, fullName?: string | null): Promise<EnvironmentValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrEnvironmentValidations.create(buildEnvironmentValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create environmentValidations");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "environment_validations", "create", `EnvironmentValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEnvironmentValidationSummary(created, maps);
    }

    async getConfigurationValidations(authUserId: string, email: string, fullName?: string | null): Promise<ConfigurationValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrConfigurationValidations.listByOrganization(context.organizationId)).map((r) => mapConfigurationValidationSummary(r, maps));
    }

    async createConfigurationValidation(authUserId: string, email: string, input: CreateConfigurationValidationInput, fullName?: string | null): Promise<ConfigurationValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrConfigurationValidations.create(buildConfigurationValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create configurationValidations");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "configuration_validations", "create", `ConfigurationValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapConfigurationValidationSummary(created, maps);
    }

    async getSecretsValidations(authUserId: string, email: string, fullName?: string | null): Promise<SecretsValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrSecretsValidations.listByOrganization(context.organizationId)).map((r) => mapSecretsValidationSummary(r, maps));
    }

    async createSecretsValidation(authUserId: string, email: string, input: CreateSecretsValidationInput, fullName?: string | null): Promise<SecretsValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrSecretsValidations.create(buildSecretsValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create secretsValidations");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "secrets_validations", "create", `SecretsValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSecretsValidationSummary(created, maps);
    }

    async getDeploymentPlans(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrDeploymentPlans.listByOrganization(context.organizationId)).map((r) => mapDeploymentPlanSummary(r, maps));
    }

    async createDeploymentPlan(authUserId: string, email: string, input: CreateDeploymentPlanInput, fullName?: string | null): Promise<DeploymentPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrDeploymentPlans.create(buildDeploymentPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deploymentPlans");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "deployment_plans", "create", `DeploymentPlan created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentPlanSummary(created, maps);
    }

    async getRollbackPlans(authUserId: string, email: string, fullName?: string | null): Promise<RollbackPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrRollbackPlans.listByOrganization(context.organizationId)).map((r) => mapRollbackPlanSummary(r, maps));
    }

    async createRollbackPlan(authUserId: string, email: string, input: CreateRollbackPlanInput, fullName?: string | null): Promise<RollbackPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrRollbackPlans.create(buildRollbackPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rollbackPlans");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "rollback_plans", "create", `RollbackPlan created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRollbackPlanSummary(created, maps);
    }

    async getVersionRegistrys(authUserId: string, email: string, fullName?: string | null): Promise<VersionRegistrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrVersionRegistry.listByOrganization(context.organizationId)).map((r) => mapVersionRegistrySummary(r, maps));
    }

    async createVersionRegistry(authUserId: string, email: string, input: CreateVersionRegistryInput, fullName?: string | null): Promise<VersionRegistrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrVersionRegistry.create(buildVersionRegistryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create versionRegistry");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "version_registry", "create", `VersionRegistry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVersionRegistrySummary(created, maps);
    }

    async getReleaseNotes(authUserId: string, email: string, fullName?: string | null): Promise<ReleaseNoteSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrReleaseNotes.listByOrganization(context.organizationId)).map((r) => mapReleaseNoteSummary(r, maps));
    }

    async createReleaseNote(authUserId: string, email: string, input: CreateReleaseNoteInput, fullName?: string | null): Promise<ReleaseNoteSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrReleaseNotes.create(buildReleaseNotePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create releaseNotes");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "release_notes", "create", `ReleaseNote created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReleaseNoteSummary(created, maps);
    }

    async getBackupPolicys(authUserId: string, email: string, fullName?: string | null): Promise<BackupPolicySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrBackupPolicies.listByOrganization(context.organizationId)).map((r) => mapBackupPolicySummary(r, maps));
    }

    async createBackupPolicy(authUserId: string, email: string, input: CreateBackupPolicyInput, fullName?: string | null): Promise<BackupPolicySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrBackupPolicies.create(buildBackupPolicyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create backupPolicies");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "backup_policies", "create", `BackupPolicy created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBackupPolicySummary(created, maps);
    }

    async getBackupVerifications(authUserId: string, email: string, fullName?: string | null): Promise<BackupVerificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrBackupVerifications.listByOrganization(context.organizationId)).map((r) => mapBackupVerificationSummary(r, maps));
    }

    async createBackupVerification(authUserId: string, email: string, input: CreateBackupVerificationInput, fullName?: string | null): Promise<BackupVerificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrBackupVerifications.create(buildBackupVerificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create backupVerifications");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "backup_verifications", "create", `BackupVerification created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBackupVerificationSummary(created, maps);
    }

    async getRestoreVerifications(authUserId: string, email: string, fullName?: string | null): Promise<RestoreVerificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrRestoreVerifications.listByOrganization(context.organizationId)).map((r) => mapRestoreVerificationSummary(r, maps));
    }

    async createRestoreVerification(authUserId: string, email: string, input: CreateRestoreVerificationInput, fullName?: string | null): Promise<RestoreVerificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrRestoreVerifications.create(buildRestoreVerificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create restoreVerifications");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "restore_verifications", "create", `RestoreVerification created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRestoreVerificationSummary(created, maps);
    }

    async getRecoveryDrills(authUserId: string, email: string, fullName?: string | null): Promise<RecoveryDrillSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrRecoveryDrills.listByOrganization(context.organizationId)).map((r) => mapRecoveryDrillSummary(r, maps));
    }

    async createRecoveryDrill(authUserId: string, email: string, input: CreateRecoveryDrillInput, fullName?: string | null): Promise<RecoveryDrillSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrRecoveryDrills.create(buildRecoveryDrillPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create recoveryDrills");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "recovery_drills", "create", `RecoveryDrill created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRecoveryDrillSummary(created, maps);
    }

    async getObservabilityLogs(authUserId: string, email: string, fullName?: string | null): Promise<ObservabilityLogSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrObservabilityLogs.listByOrganization(context.organizationId)).map((r) => mapObservabilityLogSummary(r, maps));
    }

    async createObservabilityLog(authUserId: string, email: string, input: CreateObservabilityLogInput, fullName?: string | null): Promise<ObservabilityLogSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrObservabilityLogs.create(buildObservabilityLogPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create observabilityLogs");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "observability_logs", "create", `ObservabilityLog created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapObservabilityLogSummary(created, maps);
    }

    async getObservabilityMetrics(authUserId: string, email: string, fullName?: string | null): Promise<ObservabilityMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrObservabilityMetrics.listByOrganization(context.organizationId)).map((r) => mapObservabilityMetricSummary(r, maps));
    }

    async createObservabilityMetric(authUserId: string, email: string, input: CreateObservabilityMetricInput, fullName?: string | null): Promise<ObservabilityMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrObservabilityMetrics.create(buildObservabilityMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create observabilityMetrics");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "observability_metrics", "create", `ObservabilityMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapObservabilityMetricSummary(created, maps);
    }

    async getTraceRecords(authUserId: string, email: string, fullName?: string | null): Promise<TraceRecordSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrTraceRecords.listByOrganization(context.organizationId)).map((r) => mapTraceRecordSummary(r, maps));
    }

    async createTraceRecord(authUserId: string, email: string, input: CreateTraceRecordInput, fullName?: string | null): Promise<TraceRecordSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrTraceRecords.create(buildTraceRecordPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create traceRecords");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "trace_records", "create", `TraceRecord created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapTraceRecordSummary(created, maps);
    }

    async getSlaMonitors(authUserId: string, email: string, fullName?: string | null): Promise<SlaMonitorSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrSlaMonitors.listByOrganization(context.organizationId)).map((r) => mapSlaMonitorSummary(r, maps));
    }

    async createSlaMonitor(authUserId: string, email: string, input: CreateSlaMonitorInput, fullName?: string | null): Promise<SlaMonitorSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrSlaMonitors.create(buildSlaMonitorPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create slaMonitors");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "sla_monitors", "create", `SlaMonitor created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSlaMonitorSummary(created, maps);
    }

    async getSecurityChecklists(authUserId: string, email: string, fullName?: string | null): Promise<SecurityChecklistSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrSecurityChecklists.listByOrganization(context.organizationId)).map((r) => mapSecurityChecklistSummary(r, maps));
    }

    async createSecurityChecklist(authUserId: string, email: string, input: CreateSecurityChecklistInput, fullName?: string | null): Promise<SecurityChecklistSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrSecurityChecklists.create(buildSecurityChecklistPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create securityChecklists");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "security_checklists", "create", `SecurityChecklist created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSecurityChecklistSummary(created, maps);
    }

    async getVulnerabilityReviews(authUserId: string, email: string, fullName?: string | null): Promise<VulnerabilityReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrVulnerabilityReviews.listByOrganization(context.organizationId)).map((r) => mapVulnerabilityReviewSummary(r, maps));
    }

    async createVulnerabilityReview(authUserId: string, email: string, input: CreateVulnerabilityReviewInput, fullName?: string | null): Promise<VulnerabilityReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrVulnerabilityReviews.create(buildVulnerabilityReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create vulnerabilityReviews");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "vulnerability_reviews", "create", `VulnerabilityReview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVulnerabilityReviewSummary(created, maps);
    }

    async getPermissionAudits(authUserId: string, email: string, fullName?: string | null): Promise<PermissionAuditSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrPermissionAudits.listByOrganization(context.organizationId)).map((r) => mapPermissionAuditSummary(r, maps));
    }

    async createPermissionAudit(authUserId: string, email: string, input: CreatePermissionAuditInput, fullName?: string | null): Promise<PermissionAuditSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrPermissionAudits.create(buildPermissionAuditPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create permissionAudits");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "permission_audits", "create", `PermissionAudit created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPermissionAuditSummary(created, maps);
    }

    async getComplianceReviews(authUserId: string, email: string, fullName?: string | null): Promise<ComplianceReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrComplianceReviews.listByOrganization(context.organizationId)).map((r) => mapComplianceReviewSummary(r, maps));
    }

    async createComplianceReview(authUserId: string, email: string, input: CreateComplianceReviewInput, fullName?: string | null): Promise<ComplianceReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrComplianceReviews.create(buildComplianceReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create complianceReviews");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "compliance_reviews", "create", `ComplianceReview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapComplianceReviewSummary(created, maps);
    }

    async getAdminGuides(authUserId: string, email: string, fullName?: string | null): Promise<AdminGuideSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrAdminGuides.listByOrganization(context.organizationId)).map((r) => mapAdminGuideSummary(r, maps));
    }

    async createAdminGuide(authUserId: string, email: string, input: CreateAdminGuideInput, fullName?: string | null): Promise<AdminGuideSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrAdminGuides.create(buildAdminGuidePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create adminGuides");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "admin_guides", "create", `AdminGuide created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAdminGuideSummary(created, maps);
    }

    async getUserGuides(authUserId: string, email: string, fullName?: string | null): Promise<UserGuideSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrUserGuides.listByOrganization(context.organizationId)).map((r) => mapUserGuideSummary(r, maps));
    }

    async createUserGuide(authUserId: string, email: string, input: CreateUserGuideInput, fullName?: string | null): Promise<UserGuideSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrUserGuides.create(buildUserGuidePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create userGuides");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "user_guides", "create", `UserGuide created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUserGuideSummary(created, maps);
    }

    async getDeploymentGuides(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentGuideSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrDeploymentGuides.listByOrganization(context.organizationId)).map((r) => mapDeploymentGuideSummary(r, maps));
    }

    async createDeploymentGuide(authUserId: string, email: string, input: CreateDeploymentGuideInput, fullName?: string | null): Promise<DeploymentGuideSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrDeploymentGuides.create(buildDeploymentGuidePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deploymentGuides");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "deployment_guides", "create", `DeploymentGuide created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentGuideSummary(created, maps);
    }

    async getLaunchScoreMetrics(authUserId: string, email: string, fullName?: string | null): Promise<LaunchScoreMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elrLaunchScoreMetrics.listByOrganization(context.organizationId)).map(mapLaunchScoreMetricSummary);
    }

    async createLaunchScoreMetric(authUserId: string, email: string, input: CreateLaunchScoreMetricInput, fullName?: string | null): Promise<LaunchScoreMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrLaunchScoreMetrics.create(buildLaunchScoreMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create launchScoreMetrics");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "launch_score_metrics", "create", `LaunchScoreMetric created`, created.id));
        return mapLaunchScoreMetricSummary(created);
    }

    async getReadinessValidations(authUserId: string, email: string, fullName?: string | null): Promise<ReadinessValidationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrReadinessValidations.listByOrganization(context.organizationId)).map((r) => mapReadinessValidationSummary(r, maps));
    }

    async createReadinessValidation(authUserId: string, email: string, input: CreateReadinessValidationInput, fullName?: string | null): Promise<ReadinessValidationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrReadinessValidations.create(buildReadinessValidationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create readinessValidations");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "readiness_validations", "create", `ReadinessValidation created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReadinessValidationSummary(created, maps);
    }

    async getLaunchBlockers(authUserId: string, email: string, fullName?: string | null): Promise<LaunchBlockerSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrLaunchBlockers.listByOrganization(context.organizationId)).map((r) => mapLaunchBlockerSummary(r, maps));
    }

    async createLaunchBlocker(authUserId: string, email: string, input: CreateLaunchBlockerInput, fullName?: string | null): Promise<LaunchBlockerSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrLaunchBlockers.create(buildLaunchBlockerPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create launchBlockers");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "launch_blockers", "create", `LaunchBlocker created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLaunchBlockerSummary(created, maps);
    }

    async getScoreSnapshots(authUserId: string, email: string, fullName?: string | null): Promise<ScoreSnapshotSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrScoreSnapshots.listByOrganization(context.organizationId)).map((r) => mapScoreSnapshotSummary(r, maps));
    }

    async createScoreSnapshot(authUserId: string, email: string, input: CreateScoreSnapshotInput, fullName?: string | null): Promise<ScoreSnapshotSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrScoreSnapshots.create(buildScoreSnapshotPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create scoreSnapshots");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "score_snapshots", "create", `ScoreSnapshot created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapScoreSnapshotSummary(created, maps);
    }

    async getLaunchHealths(authUserId: string, email: string, fullName?: string | null): Promise<LaunchHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elrLaunchHealth.listByOrganization(context.organizationId)).map(mapLaunchHealthSummary);
    }

    async createLaunchHealth(authUserId: string, email: string, input: CreateLaunchHealthInput, fullName?: string | null): Promise<LaunchHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrLaunchHealth.create(buildLaunchHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create launchHealth");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "launch_health", "create", `LaunchHealth created`, created.id));
        return mapLaunchHealthSummary(created);
    }

    async getCriticalIssues(authUserId: string, email: string, fullName?: string | null): Promise<CriticalIssueSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrCriticalIssues.listByOrganization(context.organizationId)).map((r) => mapCriticalIssueSummary(r, maps));
    }

    async createCriticalIssue(authUserId: string, email: string, input: CreateCriticalIssueInput, fullName?: string | null): Promise<CriticalIssueSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrCriticalIssues.create(buildCriticalIssuePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create criticalIssues");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "critical_issues", "create", `CriticalIssue created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCriticalIssueSummary(created, maps);
    }

    async getReadinessWarnings(authUserId: string, email: string, fullName?: string | null): Promise<ReadinessWarningSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrReadinessWarnings.listByOrganization(context.organizationId)).map((r) => mapReadinessWarningSummary(r, maps));
    }

    async createReadinessWarning(authUserId: string, email: string, input: CreateReadinessWarningInput, fullName?: string | null): Promise<ReadinessWarningSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrReadinessWarnings.create(buildReadinessWarningPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create readinessWarnings");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "readiness_warnings", "create", `ReadinessWarning created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReadinessWarningSummary(created, maps);
    }

    async getLaunchFailures(authUserId: string, email: string, fullName?: string | null): Promise<LaunchFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.elrLaunchFailures.listByOrganization(context.organizationId)).map((r) => mapLaunchFailureSummary(r, maps));
    }

    async createLaunchFailure(authUserId: string, email: string, input: CreateLaunchFailureInput, fullName?: string | null): Promise<LaunchFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.elrLaunchFailures.create(buildLaunchFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create launchFailures");
        await databaseService.elrAuditLogs.create(buildElrAuditPayload(context.organizationId, "launch_failures", "create", `LaunchFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLaunchFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elrAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getReadinessHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.elrReadinessHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkValidateEnvironment(authUserId: string, email: string, input: ElrSdkValidateEnvironmentInput, fullName?: string | null): Promise<ElrSdkValidateEnvironmentResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "validate_environment", moduleSource: "launch_readiness", inputPayload: { ...input } });
        const created = await this.createEnvironmentValidation(authUserId, email, { readinessHubId: input.readinessHubId, validationKey: input.validationKey, validationType: input.validationType }, fullName);
        return { validationId: created.id, validationKey: created.validationKey, status: created.status };
    }

    async sdkRunDeploymentCheck(authUserId: string, email: string, input: ElrSdkRunDeploymentCheckInput, fullName?: string | null): Promise<ElrSdkRunDeploymentCheckResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.planKey ?? input.planName ?? "deployment", limit: 3 });
        const created = await this.createDeploymentPlan(authUserId, email, { readinessHubId: input.readinessHubId, planKey: input.planKey, planName: input.planName }, fullName);
        return { planId: created.id, planKey: created.planKey, status: created.status };
    }

    async sdkRunRecoveryDrill(authUserId: string, email: string, input: ElrSdkRunRecoveryDrillInput, fullName?: string | null): Promise<ElrSdkRunRecoveryDrillResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_recovery_drill", moduleSource: "launch_readiness", inputPayload: { ...input } });
        const created = await this.createRecoveryDrill(authUserId, email, { readinessHubId: input.readinessHubId, drillKey: input.drillKey, drillType: input.drillType }, fullName);
        return { drillId: created.id, drillKey: created.drillKey, status: created.status };
    }
}

export const launchReadinessService = new LaunchReadinessService();
