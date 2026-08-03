import type {
    DbAiOrchestrationAgent,
    DbAiSession,
    DbBaBrd,
    DbBaEngagement,
    DbBaFrsDocument,
    DbClient,
    DbDdAuditLog,
    DbDdBackupVerification,
    DbDdBlueGreenPlan,
    DbDdCanaryPlan,
    DbDdCicdPipeline,
    DbDdCostEstimate,
    DbDdDeploymentApproval,
    DbDdDisasterRecoveryPlan,
    DbDdDockerConfig,
    DbDdEngagement,
    DbDdEnvironment,
    DbDdHealthCheck,
    DbDdInfrastructureTemplate,
    DbDdKubernetesPlan,
    DbDdLoggingIntegration,
    DbDdMonitoringIntegration,
    DbDdReleaseOrchestration,
    DbDdReleaseVersion,
    DbDdRollbackPlan,
    DbDfEngagement,
    DbDfWorkPackage,
    DbProject,
    DbQaEngagement,
    DbQaReleaseReadiness,
    DbSaEngagement,
    DbSaSolutionArchitecture,
} from "@/src/modules/database/types/platform";
import type {
    AuditEntry,
    BackupVerificationSummary,
    BlueGreenPlanSummary,
    CanaryPlanSummary,
    CicdPipelineSummary,
    CostEstimateSummary,
    CreateBackupVerificationInput,
    CreateBlueGreenPlanInput,
    CreateCanaryPlanInput,
    CreateCicdPipelineInput,
    CreateCostEstimateInput,
    CreateDeploymentApprovalInput,
    CreateDisasterRecoveryPlanInput,
    CreateDockerConfigInput,
    CreateEngagementInput,
    CreateEnvironmentInput,
    CreateHealthCheckInput,
    CreateInfrastructureTemplateInput,
    CreateKubernetesPlanInput,
    CreateLoggingIntegrationInput,
    CreateMonitoringIntegrationInput,
    CreateReleaseOrchestrationInput,
    CreateReleaseVersionInput,
    CreateRollbackPlanInput,
    DdDashboardStats,
    DdPipelineInfo,
    DeploymentApprovalSummary,
    DisasterRecoveryPlanSummary,
    DockerConfigSummary,
    EngagementSummary,
    EnvironmentSummary,
    HealthCheckSummary,
    InfrastructureTemplateSummary,
    KubernetesPlanSummary,
    LoggingIntegrationSummary,
    MonitoringIntegrationSummary,
    ReleaseOrchestrationSummary,
    ReleaseVersionSummary,
    RollbackPlanSummary,
} from "@/src/modules/devops-deployment/types";

type LookupMaps = {
    engagements: Map<string, DbDdEngagement>;
    baEngagements: Map<string, DbBaEngagement>;
    saEngagements: Map<string, DbSaEngagement>;
    dfEngagements: Map<string, DbDfEngagement>;
    qaEngagements: Map<string, DbQaEngagement>;
    solutionArchitectures: Map<string, DbSaSolutionArchitecture>;
    workPackages: Map<string, DbDfWorkPackage>;
    qaReleaseReadiness: Map<string, DbQaReleaseReadiness>;
    brds: Map<string, DbBaBrd>;
    frsDocuments: Map<string, DbBaFrsDocument>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
};

export const buildLookupMaps = (
    engagements: DbDdEngagement[],
    baEngagements: DbBaEngagement[],
    saEngagements: DbSaEngagement[],
    dfEngagements: DbDfEngagement[],
    qaEngagements: DbQaEngagement[],
    solutionArchitectures: DbSaSolutionArchitecture[],
    workPackages: DbDfWorkPackage[],
    qaReleaseReadinessRecords: DbQaReleaseReadiness[],
    brds: DbBaBrd[],
    frsDocuments: DbBaFrsDocument[],
    clients: DbClient[],
    projects: DbProject[],
    agents: DbAiOrchestrationAgent[],
    sessions: DbAiSession[],
): LookupMaps => ({
    engagements: new Map(engagements.map((item) => [item.id, item])),
    baEngagements: new Map(baEngagements.map((item) => [item.id, item])),
    saEngagements: new Map(saEngagements.map((item) => [item.id, item])),
    dfEngagements: new Map(dfEngagements.map((item) => [item.id, item])),
    qaEngagements: new Map(qaEngagements.map((item) => [item.id, item])),
    solutionArchitectures: new Map(solutionArchitectures.map((item) => [item.id, item])),
    workPackages: new Map(workPackages.map((item) => [item.id, item])),
    qaReleaseReadiness: new Map(qaReleaseReadinessRecords.map((item) => [item.id, item])),
    brds: new Map(brds.map((item) => [item.id, item])),
    frsDocuments: new Map(frsDocuments.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    agents: new Map(agents.map((item) => [item.id, item])),
    sessions: new Map(sessions.map((item) => [item.id, item])),
});

const engagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.engagements.get(id)?.title ?? null : null);
const baEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.baEngagements.get(id)?.title ?? null : null);
const saEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.saEngagements.get(id)?.title ?? null : null);
const dfEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.dfEngagements.get(id)?.title ?? null : null);
const qaEngagementTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.qaEngagements.get(id)?.title ?? null : null);
const solutionArchitectureTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.solutionArchitectures.get(id)?.title ?? null : null);
const workPackageTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.workPackages.get(id)?.title ?? null : null);
const qaReleaseReadinessTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.qaReleaseReadiness.get(id)?.title ?? null : null);
const clientName = (maps: LookupMaps, id?: string | null) => (id ? maps.clients.get(id)?.name ?? null : null);
const projectName = (maps: LookupMaps, id?: string | null) => (id ? maps.projects.get(id)?.name ?? null : null);
const agentName = (maps: LookupMaps, id?: string | null) => (id ? maps.agents.get(id)?.name ?? null : null);
const brdTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.brds.get(id)?.title ?? null : null);

export const mapEngagementSummary = (record: DbDdEngagement, maps: LookupMaps): EngagementSummary => ({
    id: record.id,
    title: record.title,
    engagementKey: record.engagement_key,
    baEngagementTitle: baEngagementTitle(maps, record.ba_engagement_id),
    saEngagementTitle: saEngagementTitle(maps, record.sa_engagement_id),
    dfEngagementTitle: dfEngagementTitle(maps, record.df_engagement_id),
    qaEngagementTitle: qaEngagementTitle(maps, record.qa_engagement_id),
    solutionArchitectureTitle: solutionArchitectureTitle(maps, record.solution_architecture_id),
    workPackageTitle: workPackageTitle(maps, record.work_package_id),
    qaReleaseReadinessTitle: qaReleaseReadinessTitle(maps, record.qa_release_readiness_id),
    brdTitle: brdTitle(maps, record.brd_id),
    clientName: clientName(maps, record.client_id),
    projectName: projectName(maps, record.project_id),
    agentName: agentName(maps, record.agent_id),
    pipelineStage: record.pipeline_stage,
    status: record.status,
    summaryPreview: record.summary.slice(0, 100),
    updatedAt: record.updated_at,
});

export const mapCicdPipelineSummary = (record: DbDdCicdPipeline, maps: LookupMaps): CicdPipelineSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    pipelineKey: record.pipeline_key,
    name: record.name,
    platform: record.platform,
    stageCount: Array.isArray(record.stages) ? record.stages.length : 0,
    status: record.status,
});

export const mapEnvironmentSummary = (record: DbDdEnvironment, maps: LookupMaps): EnvironmentSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    environmentKey: record.environment_key,
    name: record.name,
    environmentType: record.environment_type,
    status: record.status,
});

export const mapInfrastructureTemplateSummary = (record: DbDdInfrastructureTemplate, maps: LookupMaps): InfrastructureTemplateSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    templateKey: record.template_key,
    name: record.name,
    provider: record.provider,
    templateType: record.template_type,
    resourceCount: Array.isArray(record.resources) ? record.resources.length : 0,
    status: record.status,
});

export const mapDockerConfigSummary = (record: DbDdDockerConfig, maps: LookupMaps): DockerConfigSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    configKey: record.config_key,
    name: record.name,
    baseImage: record.base_image,
    serviceCount: Array.isArray(record.compose_services) ? record.compose_services.length : 0,
    status: record.status,
});

export const mapKubernetesPlanSummary = (record: DbDdKubernetesPlan, maps: LookupMaps): KubernetesPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    planKey: record.plan_key,
    name: record.name,
    namespace: record.namespace,
    manifestCount: Array.isArray(record.manifests) ? record.manifests.length : 0,
    status: record.status,
});

export const mapReleaseOrchestrationSummary = (record: DbDdReleaseOrchestration, maps: LookupMaps): ReleaseOrchestrationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    orchestrationKey: record.orchestration_key,
    name: record.name,
    stepCount: Array.isArray(record.release_steps) ? record.release_steps.length : 0,
    dependencyCount: Array.isArray(record.dependencies) ? record.dependencies.length : 0,
    status: record.status,
});

export const mapRollbackPlanSummary = (record: DbDdRollbackPlan, maps: LookupMaps): RollbackPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    planKey: record.plan_key,
    name: record.name,
    recoveryTimeMinutes: record.recovery_time_minutes,
    triggerCount: Array.isArray(record.rollback_triggers) ? record.rollback_triggers.length : 0,
    status: record.status,
});

export const mapBlueGreenPlanSummary = (record: DbDdBlueGreenPlan, maps: LookupMaps): BlueGreenPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    planKey: record.plan_key,
    name: record.name,
    blueEnvironment: record.blue_environment,
    greenEnvironment: record.green_environment,
    status: record.status,
});

export const mapCanaryPlanSummary = (record: DbDdCanaryPlan, maps: LookupMaps): CanaryPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    planKey: record.plan_key,
    name: record.name,
    canaryPercentage: Number(record.canary_percentage),
    status: record.status,
});

export const mapMonitoringIntegrationSummary = (record: DbDdMonitoringIntegration, maps: LookupMaps): MonitoringIntegrationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    integrationKey: record.integration_key,
    name: record.name,
    provider: record.provider,
    metricCount: Array.isArray(record.metrics) ? record.metrics.length : 0,
    status: record.status,
});

export const mapLoggingIntegrationSummary = (record: DbDdLoggingIntegration, maps: LookupMaps): LoggingIntegrationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    integrationKey: record.integration_key,
    name: record.name,
    provider: record.provider,
    retentionDays: record.retention_days,
    status: record.status,
});

export const mapHealthCheckSummary = (record: DbDdHealthCheck, maps: LookupMaps): HealthCheckSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    checkKey: record.check_key,
    name: record.name,
    endpoint: record.endpoint,
    checkIntervalSeconds: record.check_interval_seconds,
    status: record.status,
});

export const mapBackupVerificationSummary = (record: DbDdBackupVerification, maps: LookupMaps): BackupVerificationSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    verificationKey: record.verification_key,
    name: record.name,
    targetCount: Array.isArray(record.backup_targets) ? record.backup_targets.length : 0,
    resultsPreview: record.verification_results.slice(0, 80),
    status: record.status,
});

export const mapDisasterRecoveryPlanSummary = (record: DbDdDisasterRecoveryPlan, maps: LookupMaps): DisasterRecoveryPlanSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    planKey: record.plan_key,
    name: record.name,
    rtoMinutes: record.rto_minutes,
    rpoMinutes: record.rpo_minutes,
    status: record.status,
});

export const mapCostEstimateSummary = (record: DbDdCostEstimate, maps: LookupMaps): CostEstimateSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    estimateKey: record.estimate_key,
    name: record.name,
    monthlyCostUsd: Number(record.monthly_cost_usd),
    breakdownCount: Array.isArray(record.cost_breakdown) ? record.cost_breakdown.length : 0,
    status: record.status,
});

export const mapDeploymentApprovalSummary = (record: DbDdDeploymentApproval, maps: LookupMaps): DeploymentApprovalSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    approvalKey: record.approval_key,
    title: record.title,
    approverRole: record.approver_role,
    criteriaCount: Array.isArray(record.approval_criteria) ? record.approval_criteria.length : 0,
    status: record.status,
});

export const mapReleaseVersionSummary = (record: DbDdReleaseVersion, maps: LookupMaps): ReleaseVersionSummary => ({
    id: record.id,
    engagementTitle: engagementTitle(maps, record.engagement_id) ?? "Unknown",
    versionKey: record.version_key,
    versionNumber: record.version_number,
    releaseNotesPreview: record.release_notes.slice(0, 80),
    status: record.status,
});

export const mapAuditEntry = (record: DbDdAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id ?? null,
    action: record.action,
    summary: record.summary,
    createdAt: record.created_at,
});

export const buildDdDashboardStats = (input: {
    engagements: EngagementSummary[];
    cicdPipelines: CicdPipelineSummary[];
    environments: EnvironmentSummary[];
    infrastructureTemplates: InfrastructureTemplateSummary[];
    dockerConfigs: DockerConfigSummary[];
    kubernetesPlans: KubernetesPlanSummary[];
    releaseOrchestrations: ReleaseOrchestrationSummary[];
    rollbackPlans: RollbackPlanSummary[];
    blueGreenPlans: BlueGreenPlanSummary[];
    canaryPlans: CanaryPlanSummary[];
    monitoringIntegrations: MonitoringIntegrationSummary[];
    loggingIntegrations: LoggingIntegrationSummary[];
    healthChecks: HealthCheckSummary[];
    backupVerifications: BackupVerificationSummary[];
    disasterRecoveryPlans: DisasterRecoveryPlanSummary[];
    costEstimates: CostEstimateSummary[];
    deploymentApprovals: DeploymentApprovalSummary[];
    releaseVersions: ReleaseVersionSummary[];
}): DdDashboardStats => ({
    totalEngagements: input.engagements.length,
    activeEngagements: input.engagements.filter((e) => e.status === "active").length,
    cicdPipelineCount: input.cicdPipelines.length,
    environmentCount: input.environments.length,
    infrastructureTemplateCount: input.infrastructureTemplates.length,
    dockerConfigCount: input.dockerConfigs.length,
    kubernetesPlanCount: input.kubernetesPlans.length,
    releaseOrchestrationCount: input.releaseOrchestrations.length,
    rollbackPlanCount: input.rollbackPlans.length,
    blueGreenPlanCount: input.blueGreenPlans.length,
    canaryPlanCount: input.canaryPlans.length,
    monitoringIntegrationCount: input.monitoringIntegrations.length,
    loggingIntegrationCount: input.loggingIntegrations.length,
    healthCheckCount: input.healthChecks.length,
    backupVerificationCount: input.backupVerifications.length,
    disasterRecoveryPlanCount: input.disasterRecoveryPlans.length,
    costEstimateCount: input.costEstimates.length,
    pendingDeploymentApprovals: input.deploymentApprovals.filter((a) => a.status === "pending").length,
    releaseVersionCount: input.releaseVersions.length,
});

export const buildDdPipelineInfo = (): DdPipelineInfo => ({
    stages: [
        { key: "customer_requirement", label: "Customer Requirement" },
        { key: "business_analyst", label: "AI Business Analyst" },
        { key: "architecture_design", label: "AI Solution Architect" },
        { key: "development_factory", label: "AI Development Factory" },
        { key: "qa_engineering", label: "AI QA Engineering" },
        { key: "devops_deployment", label: "AI DevOps & Deployment" },
        { key: "production_deployment", label: "Production Deployment" },
    ],
    currentWorker: "AI DevOps & Deployment Engineer",
    nextWorker: "Production Deployment",
    previousWorker: "AI QA Engineer",
});

export const buildEngagementPayload = (organizationId: string, input: CreateEngagementInput) => ({
    organization_id: organizationId,
    title: input.title,
    engagement_key: input.engagementKey,
    ba_engagement_id: input.baEngagementId || null,
    sa_engagement_id: input.saEngagementId || null,
    df_engagement_id: input.dfEngagementId || null,
    qa_engagement_id: input.qaEngagementId || null,
    brd_id: input.brdId || null,
    frs_id: input.frsId || null,
    solution_architecture_id: input.solutionArchitectureId || null,
    work_package_id: input.workPackageId || null,
    qa_release_readiness_id: input.qaReleaseReadinessId || null,
    client_id: input.clientId || null,
    project_id: input.projectId || null,
    agent_id: input.agentId || null,
    session_id: input.sessionId || null,
    knowledge_context_id: input.knowledgeContextId || null,
    pipeline_stage: input.pipelineStage ?? "devops_deployment",
    summary: input.summary ?? "",
});

export const buildCicdPipelinePayload = (organizationId: string, input: CreateCicdPipelineInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    pipeline_key: input.pipelineKey,
    name: input.name,
    platform: input.platform ?? "github_actions",
    stages: input.stages ?? [],
    triggers: input.triggers ?? [],
});

export const buildEnvironmentPayload = (organizationId: string, input: CreateEnvironmentInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    environment_key: input.environmentKey,
    name: input.name,
    environment_type: input.environmentType ?? "staging",
    config: input.config ?? {},
    variables: input.variables ?? [],
});

export const buildInfrastructureTemplatePayload = (organizationId: string, input: CreateInfrastructureTemplateInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    template_key: input.templateKey,
    name: input.name,
    provider: input.provider ?? "aws",
    template_type: input.templateType ?? "terraform",
    resources: input.resources ?? [],
});

export const buildDockerConfigPayload = (organizationId: string, input: CreateDockerConfigInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    config_key: input.configKey,
    name: input.name,
    base_image: input.baseImage ?? "",
    dockerfile_content: input.dockerfileContent ?? "",
    compose_services: input.composeServices ?? [],
});

export const buildKubernetesPlanPayload = (organizationId: string, input: CreateKubernetesPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    namespace: input.namespace ?? "default",
    manifests: input.manifests ?? [],
    resource_limits: input.resourceLimits ?? {},
});

export const buildReleaseOrchestrationPayload = (organizationId: string, input: CreateReleaseOrchestrationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    orchestration_key: input.orchestrationKey,
    name: input.name,
    release_steps: input.releaseSteps ?? [],
    dependencies: input.dependencies ?? [],
});

export const buildRollbackPlanPayload = (organizationId: string, input: CreateRollbackPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    rollback_triggers: input.rollbackTriggers ?? [],
    rollback_steps: input.rollbackSteps ?? [],
    recovery_time_minutes: input.recoveryTimeMinutes ?? 15,
});

export const buildBlueGreenPlanPayload = (organizationId: string, input: CreateBlueGreenPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    blue_environment: input.blueEnvironment ?? "",
    green_environment: input.greenEnvironment ?? "",
    switch_criteria: input.switchCriteria ?? [],
});

export const buildCanaryPlanPayload = (organizationId: string, input: CreateCanaryPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    canary_percentage: input.canaryPercentage ?? 10,
    promotion_criteria: input.promotionCriteria ?? [],
    rollback_thresholds: input.rollbackThresholds ?? [],
});

export const buildMonitoringIntegrationPayload = (organizationId: string, input: CreateMonitoringIntegrationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    integration_key: input.integrationKey,
    name: input.name,
    provider: input.provider ?? "datadog",
    metrics: input.metrics ?? [],
    alerts: input.alerts ?? [],
});

export const buildLoggingIntegrationPayload = (organizationId: string, input: CreateLoggingIntegrationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    integration_key: input.integrationKey,
    name: input.name,
    provider: input.provider ?? "cloudwatch",
    log_sources: input.logSources ?? [],
    retention_days: input.retentionDays ?? 30,
});

export const buildHealthCheckPayload = (organizationId: string, input: CreateHealthCheckInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    check_key: input.checkKey,
    name: input.name,
    endpoint: input.endpoint ?? "",
    check_interval_seconds: input.checkIntervalSeconds ?? 60,
    thresholds: input.thresholds ?? {},
});

export const buildBackupVerificationPayload = (organizationId: string, input: CreateBackupVerificationInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    verification_key: input.verificationKey,
    name: input.name,
    backup_targets: input.backupTargets ?? [],
    verification_results: input.verificationResults ?? "",
});

export const buildDisasterRecoveryPlanPayload = (organizationId: string, input: CreateDisasterRecoveryPlanInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    plan_key: input.planKey,
    name: input.name,
    rto_minutes: input.rtoMinutes ?? 60,
    rpo_minutes: input.rpoMinutes ?? 15,
    recovery_steps: input.recoverySteps ?? [],
});

export const buildCostEstimatePayload = (organizationId: string, input: CreateCostEstimateInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    estimate_key: input.estimateKey,
    name: input.name,
    monthly_cost_usd: input.monthlyCostUsd ?? 0,
    cost_breakdown: input.costBreakdown ?? [],
});

export const buildDeploymentApprovalPayload = (organizationId: string, input: CreateDeploymentApprovalInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    approval_key: input.approvalKey,
    title: input.title,
    approver_role: input.approverRole ?? "release_manager",
    approval_criteria: input.approvalCriteria ?? [],
});

export const buildReleaseVersionPayload = (organizationId: string, input: CreateReleaseVersionInput) => ({
    organization_id: organizationId,
    engagement_id: input.engagementId,
    version_key: input.versionKey,
    version_number: input.versionNumber,
    release_notes: input.releaseNotes ?? "",
    changelog: input.changelog ?? [],
});

export const buildDdAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
});
