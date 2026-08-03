import type { DbElrReadinessHub,
    DbElrEnvironmentValidation,
    DbElrConfigurationValidation,
    DbElrSecretsValidation,
    DbElrDeploymentPlan,
    DbElrRollbackPlan,
    DbElrVersionRegistry,
    DbElrReleaseNote,
    DbElrBackupPolicy,
    DbElrBackupVerification,
    DbElrRestoreVerification,
    DbElrRecoveryDrill,
    DbElrObservabilityLog,
    DbElrObservabilityMetric,
    DbElrTraceRecord,
    DbElrSlaMonitor,
    DbElrSecurityChecklist,
    DbElrVulnerabilityReview,
    DbElrPermissionAudit,
    DbElrComplianceReview,
    DbElrAdminGuide,
    DbElrUserGuide,
    DbElrDeploymentGuide,
    DbElrLaunchScoreMetric,
    DbElrReadinessValidation,
    DbElrLaunchBlocker,
    DbElrScoreSnapshot,
    DbElrLaunchHealth,
    DbElrCriticalIssue,
    DbElrReadinessWarning,
    DbElrLaunchFailure,
    DbElrAuditLog } from "@/src/modules/database/types/platform";
import type { CreateReadinessHubInput,
    ReadinessHubSummary,
    CreateEnvironmentValidationInput,
    EnvironmentValidationSummary,
    CreateConfigurationValidationInput,
    ConfigurationValidationSummary,
    CreateSecretsValidationInput,
    SecretsValidationSummary,
    CreateDeploymentPlanInput,
    DeploymentPlanSummary,
    CreateRollbackPlanInput,
    RollbackPlanSummary,
    CreateVersionRegistryInput,
    VersionRegistrySummary,
    CreateReleaseNoteInput,
    ReleaseNoteSummary,
    CreateBackupPolicyInput,
    BackupPolicySummary,
    CreateBackupVerificationInput,
    BackupVerificationSummary,
    CreateRestoreVerificationInput,
    RestoreVerificationSummary,
    CreateRecoveryDrillInput,
    RecoveryDrillSummary,
    CreateObservabilityLogInput,
    ObservabilityLogSummary,
    CreateObservabilityMetricInput,
    ObservabilityMetricSummary,
    CreateTraceRecordInput,
    TraceRecordSummary,
    CreateSlaMonitorInput,
    SlaMonitorSummary,
    CreateSecurityChecklistInput,
    SecurityChecklistSummary,
    CreateVulnerabilityReviewInput,
    VulnerabilityReviewSummary,
    CreatePermissionAuditInput,
    PermissionAuditSummary,
    CreateComplianceReviewInput,
    ComplianceReviewSummary,
    CreateAdminGuideInput,
    AdminGuideSummary,
    CreateUserGuideInput,
    UserGuideSummary,
    CreateDeploymentGuideInput,
    DeploymentGuideSummary,
    CreateLaunchScoreMetricInput,
    LaunchScoreMetricSummary,
    CreateReadinessValidationInput,
    ReadinessValidationSummary,
    CreateLaunchBlockerInput,
    LaunchBlockerSummary,
    CreateScoreSnapshotInput,
    ScoreSnapshotSummary,
    CreateLaunchHealthInput,
    LaunchHealthSummary,
    CreateCriticalIssueInput,
    CriticalIssueSummary,
    CreateReadinessWarningInput,
    ReadinessWarningSummary,
    CreateLaunchFailureInput,
    LaunchFailureSummary,
    ElrDashboardStats,
    ElrPipelineInfo,
    AuditEntry } from "@/src/modules/launch-readiness/types";

export function buildReadinessHubLookupMaps(hubs: DbElrReadinessHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildElrPipelineInfo(): ElrPipelineInfo {
    const stages = [
        { key: "validate", label: "Validate" },
        { key: "deploy", label: "Deploy" },
        { key: "recover", label: "Recover" },
        { key: "launch", label: "Launch" },
    ];
    return { stages, currentStage: "deploy", nextStage: "recover", previousStage: "validate" };
}

export function buildElrAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbElrAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapReadinessHubSummary(record: DbElrReadinessHub): ReadinessHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildReadinessHubPayload(organizationId: string, input: CreateReadinessHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapEnvironmentValidationSummary(record: DbElrEnvironmentValidation, maps?: { hubNameById: Map<string, string> }): EnvironmentValidationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        validationKey: record.validation_key as string,
        validationType: record.validation_type as string,
        validationScore: record.validation_score as number,
        status: record.status,
    };
}

export function buildEnvironmentValidationPayload(organizationId: string, input: CreateEnvironmentValidationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        validation_key: input.validationKey ?? '',
        validation_type: input.validationType ?? '',
        validation_score: input.validationScore ?? 0,
        status: "active",
    };
}

export function mapConfigurationValidationSummary(record: DbElrConfigurationValidation, maps?: { hubNameById: Map<string, string> }): ConfigurationValidationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        validationKey: record.validation_key as string,
        configType: record.config_type as string,
        validationScore: record.validation_score as number,
        status: record.status,
    };
}

export function buildConfigurationValidationPayload(organizationId: string, input: CreateConfigurationValidationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        validation_key: input.validationKey ?? '',
        config_type: input.configType ?? '',
        validation_score: input.validationScore ?? 0,
        status: "active",
    };
}

export function mapSecretsValidationSummary(record: DbElrSecretsValidation, maps?: { hubNameById: Map<string, string> }): SecretsValidationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        validationKey: record.validation_key as string,
        secretType: record.secret_type as string,
        validationScore: record.validation_score as number,
        status: record.status,
    };
}

export function buildSecretsValidationPayload(organizationId: string, input: CreateSecretsValidationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        validation_key: input.validationKey ?? '',
        secret_type: input.secretType ?? '',
        validation_score: input.validationScore ?? 0,
        status: "active",
    };
}

export function mapDeploymentPlanSummary(record: DbElrDeploymentPlan, maps?: { hubNameById: Map<string, string> }): DeploymentPlanSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        planKey: record.plan_key as string,
        planName: record.plan_name as string,
        targetVersion: record.target_version as string,
        status: record.status,
    };
}

export function buildDeploymentPlanPayload(organizationId: string, input: CreateDeploymentPlanInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        plan_key: input.planKey ?? '',
        plan_name: input.planName ?? '',
        target_version: input.targetVersion ?? '',
        status: "active",
    };
}

export function mapRollbackPlanSummary(record: DbElrRollbackPlan, maps?: { hubNameById: Map<string, string> }): RollbackPlanSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        planKey: record.plan_key as string,
        rollbackVersion: record.rollback_version as string,
        rollbackReason: record.rollback_reason as string,
        status: record.status,
    };
}

export function buildRollbackPlanPayload(organizationId: string, input: CreateRollbackPlanInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        plan_key: input.planKey ?? '',
        rollback_version: input.rollbackVersion ?? '',
        rollback_reason: input.rollbackReason ?? '',
        status: "active",
    };
}

export function mapVersionRegistrySummary(record: DbElrVersionRegistry, maps?: { hubNameById: Map<string, string> }): VersionRegistrySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        versionKey: record.version_key as string,
        versionNumber: record.version_number as string,
        releaseChannel: record.release_channel as string,
        status: record.status,
    };
}

export function buildVersionRegistryPayload(organizationId: string, input: CreateVersionRegistryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        version_key: input.versionKey ?? '',
        version_number: input.versionNumber ?? '',
        release_channel: input.releaseChannel ?? '',
        status: "active",
    };
}

export function mapReleaseNoteSummary(record: DbElrReleaseNote, maps?: { hubNameById: Map<string, string> }): ReleaseNoteSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        noteKey: record.note_key as string,
        versionRef: record.version_ref as string,
        noteSummary: record.note_summary as string,
        status: record.status,
    };
}

export function buildReleaseNotePayload(organizationId: string, input: CreateReleaseNoteInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        note_key: input.noteKey ?? '',
        version_ref: input.versionRef ?? '',
        note_summary: input.noteSummary ?? '',
        status: "active",
    };
}

export function mapBackupPolicySummary(record: DbElrBackupPolicy, maps?: { hubNameById: Map<string, string> }): BackupPolicySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        policyKey: record.policy_key as string,
        policyName: record.policy_name as string,
        retentionDays: record.retention_days as number,
        status: record.status,
    };
}

export function buildBackupPolicyPayload(organizationId: string, input: CreateBackupPolicyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        policy_key: input.policyKey ?? '',
        policy_name: input.policyName ?? '',
        retention_days: input.retentionDays ?? 0,
        status: "active",
    };
}

export function mapBackupVerificationSummary(record: DbElrBackupVerification, maps?: { hubNameById: Map<string, string> }): BackupVerificationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        verificationKey: record.verification_key as string,
        backupRef: record.backup_ref as string,
        verificationScore: record.verification_score as number,
        status: record.status,
    };
}

export function buildBackupVerificationPayload(organizationId: string, input: CreateBackupVerificationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        verification_key: input.verificationKey ?? '',
        backup_ref: input.backupRef ?? '',
        verification_score: input.verificationScore ?? 0,
        status: "active",
    };
}

export function mapRestoreVerificationSummary(record: DbElrRestoreVerification, maps?: { hubNameById: Map<string, string> }): RestoreVerificationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        verificationKey: record.verification_key as string,
        restoreRef: record.restore_ref as string,
        verificationScore: record.verification_score as number,
        status: record.status,
    };
}

export function buildRestoreVerificationPayload(organizationId: string, input: CreateRestoreVerificationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        verification_key: input.verificationKey ?? '',
        restore_ref: input.restoreRef ?? '',
        verification_score: input.verificationScore ?? 0,
        status: "active",
    };
}

export function mapRecoveryDrillSummary(record: DbElrRecoveryDrill, maps?: { hubNameById: Map<string, string> }): RecoveryDrillSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        drillKey: record.drill_key as string,
        drillType: record.drill_type as string,
        drillScore: record.drill_score as number,
        status: record.status,
    };
}

export function buildRecoveryDrillPayload(organizationId: string, input: CreateRecoveryDrillInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        drill_key: input.drillKey ?? '',
        drill_type: input.drillType ?? '',
        drill_score: input.drillScore ?? 0,
        status: "active",
    };
}

export function mapObservabilityLogSummary(record: DbElrObservabilityLog, maps?: { hubNameById: Map<string, string> }): ObservabilityLogSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        logKey: record.log_key as string,
        logLevel: record.log_level as string,
        logSource: record.log_source as string,
        status: record.status,
    };
}

export function buildObservabilityLogPayload(organizationId: string, input: CreateObservabilityLogInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        log_key: input.logKey ?? '',
        log_level: input.logLevel ?? '',
        log_source: input.logSource ?? '',
        status: "active",
    };
}

export function mapObservabilityMetricSummary(record: DbElrObservabilityMetric, maps?: { hubNameById: Map<string, string> }): ObservabilityMetricSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        metricKey: record.metric_key as string,
        metricName: record.metric_name as string,
        metricValue: record.metric_value as number,
        status: record.status,
    };
}

export function buildObservabilityMetricPayload(organizationId: string, input: CreateObservabilityMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        metric_key: input.metricKey ?? '',
        metric_name: input.metricName ?? '',
        metric_value: input.metricValue ?? 0,
        status: "active",
    };
}

export function mapTraceRecordSummary(record: DbElrTraceRecord, maps?: { hubNameById: Map<string, string> }): TraceRecordSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        traceKey: record.trace_key as string,
        traceName: record.trace_name as string,
        latencyMs: record.latency_ms as number,
        status: record.status,
    };
}

export function buildTraceRecordPayload(organizationId: string, input: CreateTraceRecordInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        trace_key: input.traceKey ?? '',
        trace_name: input.traceName ?? '',
        latency_ms: input.latencyMs ?? 0,
        status: "active",
    };
}

export function mapSlaMonitorSummary(record: DbElrSlaMonitor, maps?: { hubNameById: Map<string, string> }): SlaMonitorSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        monitorKey: record.monitor_key as string,
        slaTarget: record.sla_target as number,
        currentValue: record.current_value as number,
        status: record.status,
    };
}

export function buildSlaMonitorPayload(organizationId: string, input: CreateSlaMonitorInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        monitor_key: input.monitorKey ?? '',
        sla_target: input.slaTarget ?? 0,
        current_value: input.currentValue ?? 0,
        status: "active",
    };
}

export function mapSecurityChecklistSummary(record: DbElrSecurityChecklist, maps?: { hubNameById: Map<string, string> }): SecurityChecklistSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        checklistKey: record.checklist_key as string,
        checklistName: record.checklist_name as string,
        completionScore: record.completion_score as number,
        status: record.status,
    };
}

export function buildSecurityChecklistPayload(organizationId: string, input: CreateSecurityChecklistInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        checklist_key: input.checklistKey ?? '',
        checklist_name: input.checklistName ?? '',
        completion_score: input.completionScore ?? 0,
        status: "active",
    };
}

export function mapVulnerabilityReviewSummary(record: DbElrVulnerabilityReview, maps?: { hubNameById: Map<string, string> }): VulnerabilityReviewSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reviewKey: record.review_key as string,
        vulnerabilityRef: record.vulnerability_ref as string,
        severity: record.severity as string,
        status: record.status,
    };
}

export function buildVulnerabilityReviewPayload(organizationId: string, input: CreateVulnerabilityReviewInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        review_key: input.reviewKey ?? '',
        vulnerability_ref: input.vulnerabilityRef ?? '',
        severity: input.severity ?? '',
        status: "active",
    };
}

export function mapPermissionAuditSummary(record: DbElrPermissionAudit, maps?: { hubNameById: Map<string, string> }): PermissionAuditSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        auditKey: record.audit_key as string,
        auditScope: record.audit_scope as string,
        findingCount: record.finding_count as number,
        status: record.status,
    };
}

export function buildPermissionAuditPayload(organizationId: string, input: CreatePermissionAuditInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        audit_key: input.auditKey ?? '',
        audit_scope: input.auditScope ?? '',
        finding_count: input.findingCount ?? 0,
        status: "active",
    };
}

export function mapComplianceReviewSummary(record: DbElrComplianceReview, maps?: { hubNameById: Map<string, string> }): ComplianceReviewSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reviewKey: record.review_key as string,
        complianceType: record.compliance_type as string,
        reviewScore: record.review_score as number,
        status: record.status,
    };
}

export function buildComplianceReviewPayload(organizationId: string, input: CreateComplianceReviewInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        review_key: input.reviewKey ?? '',
        compliance_type: input.complianceType ?? '',
        review_score: input.reviewScore ?? 0,
        status: "active",
    };
}

export function mapAdminGuideSummary(record: DbElrAdminGuide, maps?: { hubNameById: Map<string, string> }): AdminGuideSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        guideKey: record.guide_key as string,
        guideTitle: record.guide_title as string,
        guideVersion: record.guide_version as string,
        status: record.status,
    };
}

export function buildAdminGuidePayload(organizationId: string, input: CreateAdminGuideInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        guide_key: input.guideKey ?? '',
        guide_title: input.guideTitle ?? '',
        guide_version: input.guideVersion ?? '',
        status: "active",
    };
}

export function mapUserGuideSummary(record: DbElrUserGuide, maps?: { hubNameById: Map<string, string> }): UserGuideSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        guideKey: record.guide_key as string,
        guideTitle: record.guide_title as string,
        guideVersion: record.guide_version as string,
        status: record.status,
    };
}

export function buildUserGuidePayload(organizationId: string, input: CreateUserGuideInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        guide_key: input.guideKey ?? '',
        guide_title: input.guideTitle ?? '',
        guide_version: input.guideVersion ?? '',
        status: "active",
    };
}

export function mapDeploymentGuideSummary(record: DbElrDeploymentGuide, maps?: { hubNameById: Map<string, string> }): DeploymentGuideSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        guideKey: record.guide_key as string,
        guideTitle: record.guide_title as string,
        guideVersion: record.guide_version as string,
        status: record.status,
    };
}

export function buildDeploymentGuidePayload(organizationId: string, input: CreateDeploymentGuideInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        guide_key: input.guideKey ?? '',
        guide_title: input.guideTitle ?? '',
        guide_version: input.guideVersion ?? '',
        status: "active",
    };
}

export function mapLaunchScoreMetricSummary(record: DbElrLaunchScoreMetric): LaunchScoreMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        securityScore: record.security_score as number,
        overallLaunchScore: record.overall_launch_score as number,
        status: record.status,
    };
}

export function buildLaunchScoreMetricPayload(organizationId: string, input: CreateLaunchScoreMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        security_score: input.securityScore ?? 0,
        overall_launch_score: input.overallLaunchScore ?? 0,
        status: "active",
    };
}

export function mapReadinessValidationSummary(record: DbElrReadinessValidation, maps?: { hubNameById: Map<string, string> }): ReadinessValidationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        validationKey: record.validation_key as string,
        validationType: record.validation_type as string,
        validationScore: record.validation_score as number,
        status: record.status,
    };
}

export function buildReadinessValidationPayload(organizationId: string, input: CreateReadinessValidationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        validation_key: input.validationKey ?? '',
        validation_type: input.validationType ?? '',
        validation_score: input.validationScore ?? 0,
        status: "active",
    };
}

export function mapLaunchBlockerSummary(record: DbElrLaunchBlocker, maps?: { hubNameById: Map<string, string> }): LaunchBlockerSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        blockerKey: record.blocker_key as string,
        blockerTitle: record.blocker_title as string,
        blockerSeverity: record.blocker_severity as string,
        status: record.status,
    };
}

export function buildLaunchBlockerPayload(organizationId: string, input: CreateLaunchBlockerInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        blocker_key: input.blockerKey ?? '',
        blocker_title: input.blockerTitle ?? '',
        blocker_severity: input.blockerSeverity ?? '',
        status: "active",
    };
}

export function mapScoreSnapshotSummary(record: DbElrScoreSnapshot, maps?: { hubNameById: Map<string, string> }): ScoreSnapshotSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        snapshotKey: record.snapshot_key as string,
        snapshotDate: record.snapshot_date as string,
        overallLaunchScore: record.overall_launch_score as number,
        status: record.status,
    };
}

export function buildScoreSnapshotPayload(organizationId: string, input: CreateScoreSnapshotInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        snapshot_key: input.snapshotKey ?? '',
        snapshot_date: input.snapshotDate ?? '',
        overall_launch_score: input.overallLaunchScore ?? 0,
        status: "active",
    };
}

export function mapLaunchHealthSummary(record: DbElrLaunchHealth): LaunchHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildLaunchHealthPayload(organizationId: string, input: CreateLaunchHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapCriticalIssueSummary(record: DbElrCriticalIssue, maps?: { hubNameById: Map<string, string> }): CriticalIssueSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        issueKey: record.issue_key as string,
        issueTitle: record.issue_title as string,
        issueSeverity: record.issue_severity as string,
        status: record.status,
    };
}

export function buildCriticalIssuePayload(organizationId: string, input: CreateCriticalIssueInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        issue_key: input.issueKey ?? '',
        issue_title: input.issueTitle ?? '',
        issue_severity: input.issueSeverity ?? '',
        status: "active",
    };
}

export function mapReadinessWarningSummary(record: DbElrReadinessWarning, maps?: { hubNameById: Map<string, string> }): ReadinessWarningSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        warningKey: record.warning_key as string,
        warningType: record.warning_type as string,
        warningMessage: record.warning_message as string,
        status: record.status,
    };
}

export function buildReadinessWarningPayload(organizationId: string, input: CreateReadinessWarningInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        warning_key: input.warningKey ?? '',
        warning_type: input.warningType ?? '',
        warning_message: input.warningMessage ?? '',
        status: "active",
    };
}

export function mapLaunchFailureSummary(record: DbElrLaunchFailure, maps?: { hubNameById: Map<string, string> }): LaunchFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildLaunchFailurePayload(organizationId: string, input: CreateLaunchFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.readinessHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapDeploymentPlanForStats(r: DbElrDeploymentPlan) { return { status: r.status }; }
export function mapBackupPolicyForStats(r: DbElrBackupPolicy) { return { status: r.status }; }
export function mapLaunchScoreMetricForStats(r: DbElrLaunchScoreMetric) {
    return {
        security_score: r.security_score,
        reliability_score: r.reliability_score,
        performance_score: r.performance_score,
        documentation_score: r.documentation_score,
        operational_score: r.operational_score,
        overall_launch_score: r.overall_launch_score,
        status: r.status,
    };
}
export function mapRecoveryDrillForStats(r: DbElrRecoveryDrill) { return { drill_score: r.drill_score, status: r.status }; }
export function mapLaunchBlockerForStats(r: DbElrLaunchBlocker) { return { blocker_severity: r.blocker_severity, status: r.status }; }
export function mapReadinessValidationForStats(r: DbElrReadinessValidation) { return { validation_score: r.validation_score, status: r.status }; }
export function mapLaunchHealthForStats(r: DbElrLaunchHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapLaunchFailureForStats(r: DbElrLaunchFailure) { return { status: r.status }; }

export function buildElrDashboardStats(input: {
    readinessHubs: ReadinessHubSummary[];
    deploymentPlans: ReturnType<typeof mapDeploymentPlanForStats>[];
    backupPolicies: ReturnType<typeof mapBackupPolicyForStats>[];
    launchScoreMetrics: ReturnType<typeof mapLaunchScoreMetricForStats>[];
    recoveryDrills: ReturnType<typeof mapRecoveryDrillForStats>[];
    launchBlockers: ReturnType<typeof mapLaunchBlockerForStats>[];
    readinessValidations: ReturnType<typeof mapReadinessValidationForStats>[];
    launchHealth: ReturnType<typeof mapLaunchHealthForStats>[];
    launchFailures: LaunchFailureSummary[];
    auditLogs: AuditEntry[];
}): ElrDashboardStats {
    const activeHubs = input.readinessHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.launchScoreMetrics[0];
    const latestHealth = input.launchHealth[0];
    return {
        totalReadinessHubs: input.readinessHubs.length,
        activeReadinessHubs: activeHubs,
        deploymentPlanCount: input.deploymentPlans.length,
        backupPolicyCount: input.backupPolicies.length,
        recoveryDrillCount: input.recoveryDrills.length,
        openBlockerCount: input.launchBlockers.filter((b) => b.status === "open" || b.blocker_severity === "critical").length,
        openFailureCount: input.launchFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallLaunchScore: latestMetrics?.overall_launch_score ?? latestHealth?.overall_score ?? 0,
        securityScore: latestMetrics?.security_score ?? 0,
        reliabilityScore: latestMetrics?.reliability_score ?? 0,
        performanceScore: latestMetrics?.performance_score ?? 0,
        documentationScore: latestMetrics?.documentation_score ?? 0,
        operationalScore: latestMetrics?.operational_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
