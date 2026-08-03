export type DevopsDeploymentTab =
    | "overview"
    | "engagements"
    | "cicdPipelines"
    | "environments"
    | "infrastructureTemplates"
    | "dockerConfigs"
    | "kubernetesPlans"
    | "releaseOrchestration"
    | "rollbackPlans"
    | "blueGreenPlans"
    | "canaryPlans"
    | "monitoring"
    | "logging"
    | "healthChecks"
    | "backupVerification"
    | "disasterRecovery"
    | "costEstimates"
    | "deploymentApprovals"
    | "releaseVersions"
    | "audit"
    | "api";

export interface DdDashboardStats {
    totalEngagements: number;
    activeEngagements: number;
    cicdPipelineCount: number;
    environmentCount: number;
    infrastructureTemplateCount: number;
    dockerConfigCount: number;
    kubernetesPlanCount: number;
    releaseOrchestrationCount: number;
    rollbackPlanCount: number;
    blueGreenPlanCount: number;
    canaryPlanCount: number;
    monitoringIntegrationCount: number;
    loggingIntegrationCount: number;
    healthCheckCount: number;
    backupVerificationCount: number;
    disasterRecoveryPlanCount: number;
    costEstimateCount: number;
    pendingDeploymentApprovals: number;
    releaseVersionCount: number;
}

export interface DdPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentWorker: string;
    nextWorker: string;
    previousWorker: string;
}

export interface EngagementSummary {
    id: string;
    title: string;
    engagementKey: string;
    baEngagementTitle?: string | null;
    saEngagementTitle?: string | null;
    dfEngagementTitle?: string | null;
    qaEngagementTitle?: string | null;
    solutionArchitectureTitle?: string | null;
    workPackageTitle?: string | null;
    qaReleaseReadinessTitle?: string | null;
    brdTitle?: string | null;
    clientName?: string | null;
    projectName?: string | null;
    agentName?: string | null;
    pipelineStage: string;
    status: string;
    summaryPreview: string;
    updatedAt: string;
}

export interface CicdPipelineSummary {
    id: string;
    engagementTitle: string;
    pipelineKey: string;
    name: string;
    platform: string;
    stageCount: number;
    status: string;
}

export interface EnvironmentSummary {
    id: string;
    engagementTitle: string;
    environmentKey: string;
    name: string;
    environmentType: string;
    status: string;
}

export interface InfrastructureTemplateSummary {
    id: string;
    engagementTitle: string;
    templateKey: string;
    name: string;
    provider: string;
    templateType: string;
    resourceCount: number;
    status: string;
}

export interface DockerConfigSummary {
    id: string;
    engagementTitle: string;
    configKey: string;
    name: string;
    baseImage: string;
    serviceCount: number;
    status: string;
}

export interface KubernetesPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    namespace: string;
    manifestCount: number;
    status: string;
}

export interface ReleaseOrchestrationSummary {
    id: string;
    engagementTitle: string;
    orchestrationKey: string;
    name: string;
    stepCount: number;
    dependencyCount: number;
    status: string;
}

export interface RollbackPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    recoveryTimeMinutes: number;
    triggerCount: number;
    status: string;
}

export interface BlueGreenPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    blueEnvironment: string;
    greenEnvironment: string;
    status: string;
}

export interface CanaryPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    canaryPercentage: number;
    status: string;
}

export interface MonitoringIntegrationSummary {
    id: string;
    engagementTitle: string;
    integrationKey: string;
    name: string;
    provider: string;
    metricCount: number;
    status: string;
}

export interface LoggingIntegrationSummary {
    id: string;
    engagementTitle: string;
    integrationKey: string;
    name: string;
    provider: string;
    retentionDays: number;
    status: string;
}

export interface HealthCheckSummary {
    id: string;
    engagementTitle: string;
    checkKey: string;
    name: string;
    endpoint: string;
    checkIntervalSeconds: number;
    status: string;
}

export interface BackupVerificationSummary {
    id: string;
    engagementTitle: string;
    verificationKey: string;
    name: string;
    targetCount: number;
    resultsPreview: string;
    status: string;
}

export interface DisasterRecoveryPlanSummary {
    id: string;
    engagementTitle: string;
    planKey: string;
    name: string;
    rtoMinutes: number;
    rpoMinutes: number;
    status: string;
}

export interface CostEstimateSummary {
    id: string;
    engagementTitle: string;
    estimateKey: string;
    name: string;
    monthlyCostUsd: number;
    breakdownCount: number;
    status: string;
}

export interface DeploymentApprovalSummary {
    id: string;
    engagementTitle: string;
    approvalKey: string;
    title: string;
    approverRole: string;
    criteriaCount: number;
    status: string;
}

export interface ReleaseVersionSummary {
    id: string;
    engagementTitle: string;
    versionKey: string;
    versionNumber: string;
    releaseNotesPreview: string;
    status: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    createdAt: string;
}

export interface CreateEngagementInput {
    title: string;
    engagementKey: string;
    baEngagementId?: string;
    saEngagementId?: string;
    dfEngagementId?: string;
    qaEngagementId?: string;
    brdId?: string;
    frsId?: string;
    solutionArchitectureId?: string;
    workPackageId?: string;
    qaReleaseReadinessId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
    knowledgeContextId?: string;
    pipelineStage?: string;
    summary?: string;
}

export interface CreateCicdPipelineInput {
    engagementId: string;
    pipelineKey: string;
    name: string;
    platform?: string;
    stages?: unknown[];
    triggers?: unknown[];
}

export interface CreateEnvironmentInput {
    engagementId: string;
    environmentKey: string;
    name: string;
    environmentType?: string;
    config?: Record<string, unknown>;
    variables?: unknown[];
}

export interface CreateInfrastructureTemplateInput {
    engagementId: string;
    templateKey: string;
    name: string;
    provider?: string;
    templateType?: string;
    resources?: unknown[];
}

export interface CreateDockerConfigInput {
    engagementId: string;
    configKey: string;
    name: string;
    baseImage?: string;
    dockerfileContent?: string;
    composeServices?: unknown[];
}

export interface CreateKubernetesPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    namespace?: string;
    manifests?: unknown[];
    resourceLimits?: Record<string, unknown>;
}

export interface CreateReleaseOrchestrationInput {
    engagementId: string;
    orchestrationKey: string;
    name: string;
    releaseSteps?: unknown[];
    dependencies?: unknown[];
}

export interface CreateRollbackPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    rollbackTriggers?: unknown[];
    rollbackSteps?: unknown[];
    recoveryTimeMinutes?: number;
}

export interface CreateBlueGreenPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    blueEnvironment?: string;
    greenEnvironment?: string;
    switchCriteria?: unknown[];
}

export interface CreateCanaryPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    canaryPercentage?: number;
    promotionCriteria?: unknown[];
    rollbackThresholds?: unknown[];
}

export interface CreateMonitoringIntegrationInput {
    engagementId: string;
    integrationKey: string;
    name: string;
    provider?: string;
    metrics?: unknown[];
    alerts?: unknown[];
}

export interface CreateLoggingIntegrationInput {
    engagementId: string;
    integrationKey: string;
    name: string;
    provider?: string;
    logSources?: unknown[];
    retentionDays?: number;
}

export interface CreateHealthCheckInput {
    engagementId: string;
    checkKey: string;
    name: string;
    endpoint?: string;
    checkIntervalSeconds?: number;
    thresholds?: Record<string, unknown>;
}

export interface CreateBackupVerificationInput {
    engagementId: string;
    verificationKey: string;
    name: string;
    backupTargets?: unknown[];
    verificationResults?: string;
}

export interface CreateDisasterRecoveryPlanInput {
    engagementId: string;
    planKey: string;
    name: string;
    rtoMinutes?: number;
    rpoMinutes?: number;
    recoverySteps?: unknown[];
}

export interface CreateCostEstimateInput {
    engagementId: string;
    estimateKey: string;
    name: string;
    monthlyCostUsd?: number;
    costBreakdown?: unknown[];
}

export interface CreateDeploymentApprovalInput {
    engagementId: string;
    approvalKey: string;
    title: string;
    approverRole?: string;
    approvalCriteria?: unknown[];
}

export interface CreateReleaseVersionInput {
    engagementId: string;
    versionKey: string;
    versionNumber: string;
    releaseNotes?: string;
    changelog?: unknown[];
}

export interface DdSdkStartEngagementInput {
    title: string;
    engagementKey: string;
    baEngagementId?: string;
    saEngagementId?: string;
    dfEngagementId?: string;
    qaEngagementId?: string;
    solutionArchitectureId?: string;
    workPackageId?: string;
    qaReleaseReadinessId?: string;
    brdId?: string;
    frsId?: string;
    clientId?: string;
    projectId?: string;
    agentId?: string;
    sessionId?: string;
}

export interface DdSdkStartEngagementResult {
    engagementId: string;
    engagementKey: string;
    pipelineStage: string;
    aiTaskId?: string | null;
}

export interface DdSdkGenerateArtifactInput {
    engagementId: string;
    artifactType: "cicd_pipeline" | "environment" | "release_orchestration" | "release_version";
    title: string;
    content: string;
}

export interface DdSdkGenerateArtifactResult {
    artifactId: string;
    artifactType: string;
    status: string;
}

export interface DdSdkRunAnalysisInput {
    engagementId: string;
    analysisType: "rollback" | "cost" | "disaster_recovery";
    inputPayload: Record<string, unknown>;
}

export interface DdSdkRunAnalysisResult {
    analysisId: string;
    analysisType: string;
    status: string;
}
