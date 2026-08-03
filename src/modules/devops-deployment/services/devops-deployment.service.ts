import {
    buildBackupVerificationPayload,
    buildBlueGreenPlanPayload,
    buildCanaryPlanPayload,
    buildCicdPipelinePayload,
    buildCostEstimatePayload,
    buildDdAuditPayload,
    buildDdDashboardStats,
    buildDdPipelineInfo,
    buildDeploymentApprovalPayload,
    buildDisasterRecoveryPlanPayload,
    buildDockerConfigPayload,
    buildEngagementPayload,
    buildEnvironmentPayload,
    buildHealthCheckPayload,
    buildInfrastructureTemplatePayload,
    buildKubernetesPlanPayload,
    buildLoggingIntegrationPayload,
    buildLookupMaps,
    buildMonitoringIntegrationPayload,
    buildReleaseOrchestrationPayload,
    buildReleaseVersionPayload,
    buildRollbackPlanPayload,
    mapAuditEntry,
    mapBackupVerificationSummary,
    mapBlueGreenPlanSummary,
    mapCanaryPlanSummary,
    mapCicdPipelineSummary,
    mapCostEstimateSummary,
    mapDeploymentApprovalSummary,
    mapDisasterRecoveryPlanSummary,
    mapDockerConfigSummary,
    mapEngagementSummary,
    mapEnvironmentSummary,
    mapHealthCheckSummary,
    mapInfrastructureTemplateSummary,
    mapKubernetesPlanSummary,
    mapLoggingIntegrationSummary,
    mapMonitoringIntegrationSummary,
    mapReleaseOrchestrationSummary,
    mapReleaseVersionSummary,
    mapRollbackPlanSummary,
} from "@/src/modules/database/lib/devops-deployment-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
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
    DdSdkGenerateArtifactInput,
    DdSdkGenerateArtifactResult,
    DdSdkRunAnalysisInput,
    DdSdkRunAnalysisResult,
    DdSdkStartEngagementInput,
    DdSdkStartEngagementResult,
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

export class DevopsDeploymentService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [ddEngagements, baEngagements, saEngagements, dfEngagements, qaEngagements, solutionArchitectures, workPackages, qaReleaseReadiness, baBrds, baFrsDocuments, clients, projects, agents, sessions] = await Promise.all([
            databaseService.ddEngagements.listByOrganization(organizationId),
            databaseService.baEngagements.listByOrganization(organizationId),
            databaseService.saEngagements.listByOrganization(organizationId),
            databaseService.dfEngagements.listByOrganization(organizationId),
            databaseService.qaEngagements.listByOrganization(organizationId),
            databaseService.saSolutionArchitectures.listByOrganization(organizationId),
            databaseService.dfWorkPackages.listByOrganization(organizationId),
            databaseService.qaReleaseReadiness.listByOrganization(organizationId),
            databaseService.baBrds.listByOrganization(organizationId),
            databaseService.baFrsDocuments.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(ddEngagements, baEngagements, saEngagements, dfEngagements, qaEngagements, solutionArchitectures, workPackages, qaReleaseReadiness, baBrds, baFrsDocuments, clients, projects, agents, sessions);
    }

    async getEngagements(authUserId: string, email: string, fullName?: string | null): Promise<EngagementSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddEngagements.listByOrganization(context.organizationId)).map((e) => mapEngagementSummary(e, maps));
    }

    async createEngagement(authUserId: string, email: string, input: CreateEngagementInput, fullName?: string | null): Promise<EngagementSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddEngagements.create(buildEngagementPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create engagement");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "engagement", "create", `Engagement ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEngagementSummary(created, maps);
    }

    async getCicdPipelines(authUserId: string, email: string, fullName?: string | null): Promise<CicdPipelineSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddCicdPipelines.listByOrganization(context.organizationId)).map((r) => mapCicdPipelineSummary(r, maps));
    }

    async createCicdPipeline(authUserId: string, email: string, input: CreateCicdPipelineInput, fullName?: string | null): Promise<CicdPipelineSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddCicdPipelines.create(buildCicdPipelinePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create CI/CD pipeline");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "cicd_pipeline", "create", `CI/CD pipeline ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCicdPipelineSummary(created, maps);
    }

    async getEnvironments(authUserId: string, email: string, fullName?: string | null): Promise<EnvironmentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddEnvironments.listByOrganization(context.organizationId)).map((r) => mapEnvironmentSummary(r, maps));
    }

    async createEnvironment(authUserId: string, email: string, input: CreateEnvironmentInput, fullName?: string | null): Promise<EnvironmentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddEnvironments.create(buildEnvironmentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create environment");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "environment", "create", `Environment ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEnvironmentSummary(created, maps);
    }

    async getInfrastructureTemplates(authUserId: string, email: string, fullName?: string | null): Promise<InfrastructureTemplateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddInfrastructureTemplates.listByOrganization(context.organizationId)).map((r) => mapInfrastructureTemplateSummary(r, maps));
    }

    async createInfrastructureTemplate(authUserId: string, email: string, input: CreateInfrastructureTemplateInput, fullName?: string | null): Promise<InfrastructureTemplateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddInfrastructureTemplates.create(buildInfrastructureTemplatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create infrastructure template");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "infrastructure_template", "create", `Infrastructure template ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapInfrastructureTemplateSummary(created, maps);
    }

    async getDockerConfigs(authUserId: string, email: string, fullName?: string | null): Promise<DockerConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddDockerConfigs.listByOrganization(context.organizationId)).map((r) => mapDockerConfigSummary(r, maps));
    }

    async createDockerConfig(authUserId: string, email: string, input: CreateDockerConfigInput, fullName?: string | null): Promise<DockerConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddDockerConfigs.create(buildDockerConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create Docker config");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "docker_config", "create", `Docker config ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDockerConfigSummary(created, maps);
    }

    async getKubernetesPlans(authUserId: string, email: string, fullName?: string | null): Promise<KubernetesPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddKubernetesPlans.listByOrganization(context.organizationId)).map((r) => mapKubernetesPlanSummary(r, maps));
    }

    async createKubernetesPlan(authUserId: string, email: string, input: CreateKubernetesPlanInput, fullName?: string | null): Promise<KubernetesPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddKubernetesPlans.create(buildKubernetesPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create Kubernetes plan");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "kubernetes_plan", "create", `Kubernetes plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapKubernetesPlanSummary(created, maps);
    }

    async getReleaseOrchestrations(authUserId: string, email: string, fullName?: string | null): Promise<ReleaseOrchestrationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddReleaseOrchestrations.listByOrganization(context.organizationId)).map((r) => mapReleaseOrchestrationSummary(r, maps));
    }

    async createReleaseOrchestration(authUserId: string, email: string, input: CreateReleaseOrchestrationInput, fullName?: string | null): Promise<ReleaseOrchestrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddReleaseOrchestrations.create(buildReleaseOrchestrationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create release orchestration");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "release_orchestration", "create", `Release orchestration ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReleaseOrchestrationSummary(created, maps);
    }

    async getRollbackPlans(authUserId: string, email: string, fullName?: string | null): Promise<RollbackPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddRollbackPlans.listByOrganization(context.organizationId)).map((r) => mapRollbackPlanSummary(r, maps));
    }

    async createRollbackPlan(authUserId: string, email: string, input: CreateRollbackPlanInput, fullName?: string | null): Promise<RollbackPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddRollbackPlans.create(buildRollbackPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rollback plan");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "rollback_plan", "create", `Rollback plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRollbackPlanSummary(created, maps);
    }

    async getBlueGreenPlans(authUserId: string, email: string, fullName?: string | null): Promise<BlueGreenPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddBlueGreenPlans.listByOrganization(context.organizationId)).map((r) => mapBlueGreenPlanSummary(r, maps));
    }

    async createBlueGreenPlan(authUserId: string, email: string, input: CreateBlueGreenPlanInput, fullName?: string | null): Promise<BlueGreenPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddBlueGreenPlans.create(buildBlueGreenPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create blue-green plan");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "blue_green_plan", "create", `Blue-green plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBlueGreenPlanSummary(created, maps);
    }

    async getCanaryPlans(authUserId: string, email: string, fullName?: string | null): Promise<CanaryPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddCanaryPlans.listByOrganization(context.organizationId)).map((r) => mapCanaryPlanSummary(r, maps));
    }

    async createCanaryPlan(authUserId: string, email: string, input: CreateCanaryPlanInput, fullName?: string | null): Promise<CanaryPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddCanaryPlans.create(buildCanaryPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create canary plan");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "canary_plan", "create", `Canary plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCanaryPlanSummary(created, maps);
    }

    async getMonitoringIntegrations(authUserId: string, email: string, fullName?: string | null): Promise<MonitoringIntegrationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddMonitoringIntegrations.listByOrganization(context.organizationId)).map((r) => mapMonitoringIntegrationSummary(r, maps));
    }

    async createMonitoringIntegration(authUserId: string, email: string, input: CreateMonitoringIntegrationInput, fullName?: string | null): Promise<MonitoringIntegrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddMonitoringIntegrations.create(buildMonitoringIntegrationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create monitoring integration");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "monitoring_integration", "create", `Monitoring integration ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMonitoringIntegrationSummary(created, maps);
    }

    async getLoggingIntegrations(authUserId: string, email: string, fullName?: string | null): Promise<LoggingIntegrationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddLoggingIntegrations.listByOrganization(context.organizationId)).map((r) => mapLoggingIntegrationSummary(r, maps));
    }

    async createLoggingIntegration(authUserId: string, email: string, input: CreateLoggingIntegrationInput, fullName?: string | null): Promise<LoggingIntegrationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddLoggingIntegrations.create(buildLoggingIntegrationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create logging integration");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "logging_integration", "create", `Logging integration ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLoggingIntegrationSummary(created, maps);
    }

    async getHealthChecks(authUserId: string, email: string, fullName?: string | null): Promise<HealthCheckSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddHealthChecks.listByOrganization(context.organizationId)).map((r) => mapHealthCheckSummary(r, maps));
    }

    async createHealthCheck(authUserId: string, email: string, input: CreateHealthCheckInput, fullName?: string | null): Promise<HealthCheckSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddHealthChecks.create(buildHealthCheckPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create health check");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "health_check", "create", `Health check ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapHealthCheckSummary(created, maps);
    }

    async getBackupVerifications(authUserId: string, email: string, fullName?: string | null): Promise<BackupVerificationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddBackupVerifications.listByOrganization(context.organizationId)).map((r) => mapBackupVerificationSummary(r, maps));
    }

    async createBackupVerification(authUserId: string, email: string, input: CreateBackupVerificationInput, fullName?: string | null): Promise<BackupVerificationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddBackupVerifications.create(buildBackupVerificationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create backup verification");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "backup_verification", "create", `Backup verification ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBackupVerificationSummary(created, maps);
    }

    async getDisasterRecoveryPlans(authUserId: string, email: string, fullName?: string | null): Promise<DisasterRecoveryPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddDisasterRecoveryPlans.listByOrganization(context.organizationId)).map((r) => mapDisasterRecoveryPlanSummary(r, maps));
    }

    async createDisasterRecoveryPlan(authUserId: string, email: string, input: CreateDisasterRecoveryPlanInput, fullName?: string | null): Promise<DisasterRecoveryPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddDisasterRecoveryPlans.create(buildDisasterRecoveryPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create disaster recovery plan");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "disaster_recovery_plan", "create", `Disaster recovery plan ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDisasterRecoveryPlanSummary(created, maps);
    }

    async getCostEstimates(authUserId: string, email: string, fullName?: string | null): Promise<CostEstimateSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddCostEstimates.listByOrganization(context.organizationId)).map((r) => mapCostEstimateSummary(r, maps));
    }

    async createCostEstimate(authUserId: string, email: string, input: CreateCostEstimateInput, fullName?: string | null): Promise<CostEstimateSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddCostEstimates.create(buildCostEstimatePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create cost estimate");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "cost_estimate", "create", `Cost estimate ${created.name} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCostEstimateSummary(created, maps);
    }

    async getDeploymentApprovals(authUserId: string, email: string, fullName?: string | null): Promise<DeploymentApprovalSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddDeploymentApprovals.listByOrganization(context.organizationId)).map((r) => mapDeploymentApprovalSummary(r, maps));
    }

    async createDeploymentApproval(authUserId: string, email: string, input: CreateDeploymentApprovalInput, fullName?: string | null): Promise<DeploymentApprovalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddDeploymentApprovals.create(buildDeploymentApprovalPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create deployment approval");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "deployment_approval", "create", `Deployment approval ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDeploymentApprovalSummary(created, maps);
    }

    async getReleaseVersions(authUserId: string, email: string, fullName?: string | null): Promise<ReleaseVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.ddReleaseVersions.listByOrganization(context.organizationId)).map((r) => mapReleaseVersionSummary(r, maps));
    }

    async createReleaseVersion(authUserId: string, email: string, input: CreateReleaseVersionInput, fullName?: string | null): Promise<ReleaseVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.ddReleaseVersions.create(buildReleaseVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create release version");
        await databaseService.ddAuditLogs.create(buildDdAuditPayload(context.organizationId, "release_version", "create", `Release version ${created.version_number} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapReleaseVersionSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getPipelineInfo(): Promise<DdPipelineInfo> {
        return buildDdPipelineInfo();
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<DdDashboardStats> {
        const [engagements, cicdPipelines, environments, infrastructureTemplates, dockerConfigs, kubernetesPlans, releaseOrchestrations, rollbackPlans, blueGreenPlans, canaryPlans, monitoringIntegrations, loggingIntegrations, healthChecks, backupVerifications, disasterRecoveryPlans, costEstimates, deploymentApprovals, releaseVersions] = await Promise.all([
            this.getEngagements(authUserId, email, fullName),
            this.getCicdPipelines(authUserId, email, fullName),
            this.getEnvironments(authUserId, email, fullName),
            this.getInfrastructureTemplates(authUserId, email, fullName),
            this.getDockerConfigs(authUserId, email, fullName),
            this.getKubernetesPlans(authUserId, email, fullName),
            this.getReleaseOrchestrations(authUserId, email, fullName),
            this.getRollbackPlans(authUserId, email, fullName),
            this.getBlueGreenPlans(authUserId, email, fullName),
            this.getCanaryPlans(authUserId, email, fullName),
            this.getMonitoringIntegrations(authUserId, email, fullName),
            this.getLoggingIntegrations(authUserId, email, fullName),
            this.getHealthChecks(authUserId, email, fullName),
            this.getBackupVerifications(authUserId, email, fullName),
            this.getDisasterRecoveryPlans(authUserId, email, fullName),
            this.getCostEstimates(authUserId, email, fullName),
            this.getDeploymentApprovals(authUserId, email, fullName),
            this.getReleaseVersions(authUserId, email, fullName),
        ]);
        return buildDdDashboardStats({ engagements, cicdPipelines, environments, infrastructureTemplates, dockerConfigs, kubernetesPlans, releaseOrchestrations, rollbackPlans, blueGreenPlans, canaryPlans, monitoringIntegrations, loggingIntegrations, healthChecks, backupVerifications, disasterRecoveryPlans, costEstimates, deploymentApprovals, releaseVersions });
    }

    async sdkStartEngagement(authUserId: string, email: string, input: DdSdkStartEngagementInput, fullName?: string | null): Promise<DdSdkStartEngagementResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        const context = await knowledge.resolveContext({ contextKey: `dd-${input.engagementKey}`, agentId: input.agentId, sessionId: input.sessionId });
        const engagement = await this.createEngagement(authUserId, email, { ...input, knowledgeContextId: context.contextId, pipelineStage: "devops_deployment" }, fullName);
        let aiTaskId: string | null = null;
        if (input.agentId && input.sessionId) {
            const task = await ai.executeTask({ taskType: "devops_deployment", agentId: input.agentId, sessionId: input.sessionId, moduleSource: "devops_deployment", inputPayload: { engagementKey: input.engagementKey, title: input.title } });
            aiTaskId = task.taskId;
        }
        if (input.clientId) {
            await knowledge.storeMemory({ entityType: "client", entityId: input.clientId, memoryKey: `dd-${input.engagementKey}`, summary: input.title });
        }
        return { engagementId: engagement.id, engagementKey: engagement.engagementKey, pipelineStage: engagement.pipelineStage, aiTaskId };
    }

    async sdkGenerateArtifact(authUserId: string, email: string, input: DdSdkGenerateArtifactInput, fullName?: string | null): Promise<DdSdkGenerateArtifactResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: `generate_${input.artifactType}`, moduleSource: "devops_deployment", inputPayload: { engagementId: input.engagementId, title: input.title, content: input.content } });
        const key = input.title.replace(/\s+/g, "-").toLowerCase();
        if (input.artifactType === "cicd_pipeline") {
            const created = await this.createCicdPipeline(authUserId, email, { engagementId: input.engagementId, pipelineKey: key, name: input.title, platform: input.content }, fullName);
            return { artifactId: created.id, artifactType: "cicd_pipeline", status: created.status };
        }
        if (input.artifactType === "environment") {
            const created = await this.createEnvironment(authUserId, email, { engagementId: input.engagementId, environmentKey: key, name: input.title, environmentType: input.content }, fullName);
            return { artifactId: created.id, artifactType: "environment", status: created.status };
        }
        if (input.artifactType === "release_orchestration") {
            const created = await this.createReleaseOrchestration(authUserId, email, { engagementId: input.engagementId, orchestrationKey: key, name: input.title }, fullName);
            return { artifactId: created.id, artifactType: "release_orchestration", status: created.status };
        }
        const created = await this.createReleaseVersion(authUserId, email, { engagementId: input.engagementId, versionKey: key, versionNumber: input.content, releaseNotes: input.title }, fullName);
        return { artifactId: created.id, artifactType: "release_version", status: created.status };
    }

    async sdkRunAnalysis(authUserId: string, email: string, input: DdSdkRunAnalysisInput, fullName?: string | null): Promise<DdSdkRunAnalysisResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.analysisType, limit: 5 });
        await ai.executeTask({ taskType: `dd_${input.analysisType}_analysis`, moduleSource: "devops_deployment", inputPayload: { engagementId: input.engagementId, ...input.inputPayload } });
        if (input.analysisType === "rollback") {
            const created = await this.createRollbackPlan(authUserId, email, { engagementId: input.engagementId, planKey: String(input.inputPayload.planKey ?? "RB-AUTO"), name: String(input.inputPayload.name ?? "Rollback Analysis"), rollbackTriggers: (input.inputPayload.rollbackTriggers as unknown[]) ?? [], rollbackSteps: (input.inputPayload.rollbackSteps as unknown[]) ?? [], recoveryTimeMinutes: Number(input.inputPayload.recoveryTimeMinutes ?? 15) }, fullName);
            return { analysisId: created.id, analysisType: "rollback", status: created.status };
        }
        if (input.analysisType === "cost") {
            const created = await this.createCostEstimate(authUserId, email, { engagementId: input.engagementId, estimateKey: String(input.inputPayload.estimateKey ?? "COST-AUTO"), name: String(input.inputPayload.name ?? "Cost Analysis"), monthlyCostUsd: Number(input.inputPayload.monthlyCostUsd ?? 0), costBreakdown: (input.inputPayload.costBreakdown as unknown[]) ?? [] }, fullName);
            return { analysisId: created.id, analysisType: "cost", status: created.status };
        }
        const created = await this.createDisasterRecoveryPlan(authUserId, email, { engagementId: input.engagementId, planKey: String(input.inputPayload.planKey ?? "DR-AUTO"), name: String(input.inputPayload.name ?? "Disaster Recovery Analysis"), rtoMinutes: Number(input.inputPayload.rtoMinutes ?? 60), rpoMinutes: Number(input.inputPayload.rpoMinutes ?? 15), recoverySteps: (input.inputPayload.recoverySteps as unknown[]) ?? [] }, fullName);
        return { analysisId: created.id, analysisType: "disaster_recovery", status: created.status };
    }

    async getEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.ddEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getQaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.qaEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getBaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getSaEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getDfEngagementOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfEngagements.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getQaReleaseReadinessOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.qaReleaseReadiness.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.title }));
    }

    async getSolutionArchitectureOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.saSolutionArchitectures.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.title }));
    }

    async getWorkPackageOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfWorkPackages.listByOrganization(context.organizationId)).map((w) => ({ id: w.id, name: w.title }));
    }

    async getBrdOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baBrds.listByOrganization(context.organizationId)).map((b) => ({ id: b.id, name: b.title }));
    }

    async getFrsOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.baFrsDocuments.listByOrganization(context.organizationId)).map((f) => ({ id: f.id, name: f.title }));
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.clients.listByOrganization(context.organizationId)).map((c) => ({ id: c.id, name: c.name }));
    }

    async getProjectOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.projects.listByOrganization(context.organizationId)).map((p) => ({ id: p.id, name: p.name }));
    }

    async getAgentOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiOrchestrationAgents.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.name }));
    }

    async getSessionOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiSessions.listByOrganization(context.organizationId)).map((s) => ({ id: s.id, name: s.session_key }));
    }
}

export const devopsDeploymentService = new DevopsDeploymentService();
