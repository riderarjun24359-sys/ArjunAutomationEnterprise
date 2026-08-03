"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { buildDdDashboardStats } from "@/src/modules/database/lib/devops-deployment-mappers";
import { devopsDeploymentService } from "@/src/modules/devops-deployment/services/devops-deployment.service";
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

export function useDevopsDeployment() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DdDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<DdPipelineInfo | null>(null);
    const [engagements, setEngagements] = useState<EngagementSummary[]>([]);
    const [cicdPipelines, setCicdPipelines] = useState<CicdPipelineSummary[]>([]);
    const [environments, setEnvironments] = useState<EnvironmentSummary[]>([]);
    const [infrastructureTemplates, setInfrastructureTemplates] = useState<InfrastructureTemplateSummary[]>([]);
    const [dockerConfigs, setDockerConfigs] = useState<DockerConfigSummary[]>([]);
    const [kubernetesPlans, setKubernetesPlans] = useState<KubernetesPlanSummary[]>([]);
    const [releaseOrchestrations, setReleaseOrchestrations] = useState<ReleaseOrchestrationSummary[]>([]);
    const [rollbackPlans, setRollbackPlans] = useState<RollbackPlanSummary[]>([]);
    const [blueGreenPlans, setBlueGreenPlans] = useState<BlueGreenPlanSummary[]>([]);
    const [canaryPlans, setCanaryPlans] = useState<CanaryPlanSummary[]>([]);
    const [monitoringIntegrations, setMonitoringIntegrations] = useState<MonitoringIntegrationSummary[]>([]);
    const [loggingIntegrations, setLoggingIntegrations] = useState<LoggingIntegrationSummary[]>([]);
    const [healthChecks, setHealthChecks] = useState<HealthCheckSummary[]>([]);
    const [backupVerifications, setBackupVerifications] = useState<BackupVerificationSummary[]>([]);
    const [disasterRecoveryPlans, setDisasterRecoveryPlans] = useState<DisasterRecoveryPlanSummary[]>([]);
    const [costEstimates, setCostEstimates] = useState<CostEstimateSummary[]>([]);
    const [deploymentApprovals, setDeploymentApprovals] = useState<DeploymentApprovalSummary[]>([]);
    const [releaseVersions, setReleaseVersions] = useState<ReleaseVersionSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [engagementOptions, setEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [qaEngagementOptions, setQaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [baEngagementOptions, setBaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [saEngagementOptions, setSaEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [dfEngagementOptions, setDfEngagementOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [qaReleaseReadinessOptions, setQaReleaseReadinessOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [solutionArchitectureOptions, setSolutionArchitectureOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [workPackageOptions, setWorkPackageOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [brdOptions, setBrdOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [frsOptions, setFrsOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [projectOptions, setProjectOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [agentOptions, setAgentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [sessionOptions, setSessionOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!user) return { empty: true as const };
        const [
            pipelineInfo,
            engagementList,
            cicdPipelineList,
            environmentList,
            infrastructureTemplateList,
            dockerConfigList,
            kubernetesPlanList,
            releaseOrchestrationList,
            rollbackPlanList,
            blueGreenPlanList,
            canaryPlanList,
            monitoringList,
            loggingList,
            healthCheckList,
            backupList,
            disasterRecoveryList,
            costList,
            approvalList,
            versionList,
            auditList,
            engagements,
            qaEngagements,
            baEngagements,
            saEngagements,
            dfEngagements,
            qaReleaseReadiness,
            solutionArchitectures,
            workPackages,
            brds,
            frsDocuments,
            clients,
            projects,
            agents,
            sessions,
        ] = await Promise.all([
            devopsDeploymentService.getPipelineInfo(),
            devopsDeploymentService.getEngagements(user.id, user.email, user.fullName),
            devopsDeploymentService.getCicdPipelines(user.id, user.email, user.fullName),
            devopsDeploymentService.getEnvironments(user.id, user.email, user.fullName),
            devopsDeploymentService.getInfrastructureTemplates(user.id, user.email, user.fullName),
            devopsDeploymentService.getDockerConfigs(user.id, user.email, user.fullName),
            devopsDeploymentService.getKubernetesPlans(user.id, user.email, user.fullName),
            devopsDeploymentService.getReleaseOrchestrations(user.id, user.email, user.fullName),
            devopsDeploymentService.getRollbackPlans(user.id, user.email, user.fullName),
            devopsDeploymentService.getBlueGreenPlans(user.id, user.email, user.fullName),
            devopsDeploymentService.getCanaryPlans(user.id, user.email, user.fullName),
            devopsDeploymentService.getMonitoringIntegrations(user.id, user.email, user.fullName),
            devopsDeploymentService.getLoggingIntegrations(user.id, user.email, user.fullName),
            devopsDeploymentService.getHealthChecks(user.id, user.email, user.fullName),
            devopsDeploymentService.getBackupVerifications(user.id, user.email, user.fullName),
            devopsDeploymentService.getDisasterRecoveryPlans(user.id, user.email, user.fullName),
            devopsDeploymentService.getCostEstimates(user.id, user.email, user.fullName),
            devopsDeploymentService.getDeploymentApprovals(user.id, user.email, user.fullName),
            devopsDeploymentService.getReleaseVersions(user.id, user.email, user.fullName),
            devopsDeploymentService.getAuditLogs(user.id, user.email, user.fullName),
            devopsDeploymentService.getEngagementOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getQaEngagementOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getBaEngagementOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getSaEngagementOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getDfEngagementOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getQaReleaseReadinessOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getSolutionArchitectureOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getWorkPackageOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getBrdOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getFrsOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getClientOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getProjectOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getAgentOptions(user.id, user.email, user.fullName),
            devopsDeploymentService.getSessionOptions(user.id, user.email, user.fullName),
        ]);
        const dashboardStats = buildDdDashboardStats({
            engagements: engagementList,
            cicdPipelines: cicdPipelineList,
            environments: environmentList,
            infrastructureTemplates: infrastructureTemplateList,
            dockerConfigs: dockerConfigList,
            kubernetesPlans: kubernetesPlanList,
            releaseOrchestrations: releaseOrchestrationList,
            rollbackPlans: rollbackPlanList,
            blueGreenPlans: blueGreenPlanList,
            canaryPlans: canaryPlanList,
            monitoringIntegrations: monitoringList,
            loggingIntegrations: loggingList,
            healthChecks: healthCheckList,
            backupVerifications: backupList,
            disasterRecoveryPlans: disasterRecoveryList,
            costEstimates: costList,
            deploymentApprovals: approvalList,
            releaseVersions: versionList,
        });
        return {
            empty: false as const,
            pipelineInfo,
            dashboardStats,
            engagementList,
            cicdPipelineList,
            environmentList,
            infrastructureTemplateList,
            dockerConfigList,
            kubernetesPlanList,
            releaseOrchestrationList,
            rollbackPlanList,
            blueGreenPlanList,
            canaryPlanList,
            monitoringList,
            loggingList,
            healthCheckList,
            backupList,
            disasterRecoveryList,
            costList,
            approvalList,
            versionList,
            auditList,
            engagements,
            qaEngagements,
            baEngagements,
            saEngagements,
            dfEngagements,
            qaReleaseReadiness,
            solutionArchitectures,
            workPackages,
            brds,
            frsDocuments,
            clients,
            projects,
            agents,
            sessions,
        };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchData>>) => {
        if (data.empty) { setLoading(false); return; }
        setPipeline(data.pipelineInfo);
        setStats(data.dashboardStats);
        setEngagements(data.engagementList);
        setCicdPipelines(data.cicdPipelineList);
        setEnvironments(data.environmentList);
        setInfrastructureTemplates(data.infrastructureTemplateList);
        setDockerConfigs(data.dockerConfigList);
        setKubernetesPlans(data.kubernetesPlanList);
        setReleaseOrchestrations(data.releaseOrchestrationList);
        setRollbackPlans(data.rollbackPlanList);
        setBlueGreenPlans(data.blueGreenPlanList);
        setCanaryPlans(data.canaryPlanList);
        setMonitoringIntegrations(data.monitoringList);
        setLoggingIntegrations(data.loggingList);
        setHealthChecks(data.healthCheckList);
        setBackupVerifications(data.backupList);
        setDisasterRecoveryPlans(data.disasterRecoveryList);
        setCostEstimates(data.costList);
        setDeploymentApprovals(data.approvalList);
        setReleaseVersions(data.versionList);
        setAuditLogs(data.auditList);
        setEngagementOptions(data.engagements);
        setQaEngagementOptions(data.qaEngagements);
        setBaEngagementOptions(data.baEngagements);
        setSaEngagementOptions(data.saEngagements);
        setDfEngagementOptions(data.dfEngagements);
        setQaReleaseReadinessOptions(data.qaReleaseReadiness);
        setSolutionArchitectureOptions(data.solutionArchitectures);
        setWorkPackageOptions(data.workPackages);
        setBrdOptions(data.brds);
        setFrsOptions(data.frsDocuments);
        setClientOptions(data.clients);
        setProjectOptions(data.projects);
        setAgentOptions(data.agents);
        setSessionOptions(data.sessions);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createEngagement = useCallback(async (input: CreateEngagementInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createEngagement(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCicdPipeline = useCallback(async (input: CreateCicdPipelineInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createCicdPipeline(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createEnvironment = useCallback(async (input: CreateEnvironmentInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createEnvironment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInfrastructureTemplate = useCallback(async (input: CreateInfrastructureTemplateInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createInfrastructureTemplate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDockerConfig = useCallback(async (input: CreateDockerConfigInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createDockerConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createKubernetesPlan = useCallback(async (input: CreateKubernetesPlanInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createKubernetesPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReleaseOrchestration = useCallback(async (input: CreateReleaseOrchestrationInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createReleaseOrchestration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRollbackPlan = useCallback(async (input: CreateRollbackPlanInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createRollbackPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBlueGreenPlan = useCallback(async (input: CreateBlueGreenPlanInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createBlueGreenPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCanaryPlan = useCallback(async (input: CreateCanaryPlanInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createCanaryPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMonitoringIntegration = useCallback(async (input: CreateMonitoringIntegrationInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createMonitoringIntegration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLoggingIntegration = useCallback(async (input: CreateLoggingIntegrationInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createLoggingIntegration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHealthCheck = useCallback(async (input: CreateHealthCheckInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createHealthCheck(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBackupVerification = useCallback(async (input: CreateBackupVerificationInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createBackupVerification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDisasterRecoveryPlan = useCallback(async (input: CreateDisasterRecoveryPlanInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createDisasterRecoveryPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCostEstimate = useCallback(async (input: CreateCostEstimateInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createCostEstimate(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeploymentApproval = useCallback(async (input: CreateDeploymentApprovalInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createDeploymentApproval(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReleaseVersion = useCallback(async (input: CreateReleaseVersionInput) => { if (!user) throw new Error("Authentication required"); await devopsDeploymentService.createReleaseVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        engagements,
        cicdPipelines,
        environments,
        infrastructureTemplates,
        dockerConfigs,
        kubernetesPlans,
        releaseOrchestrations,
        rollbackPlans,
        blueGreenPlans,
        canaryPlans,
        monitoringIntegrations,
        loggingIntegrations,
        healthChecks,
        backupVerifications,
        disasterRecoveryPlans,
        costEstimates,
        deploymentApprovals,
        releaseVersions,
        auditLogs,
        engagementOptions,
        qaEngagementOptions,
        baEngagementOptions,
        saEngagementOptions,
        dfEngagementOptions,
        qaReleaseReadinessOptions,
        solutionArchitectureOptions,
        workPackageOptions,
        brdOptions,
        frsOptions,
        clientOptions,
        projectOptions,
        agentOptions,
        sessionOptions,
        createEngagement,
        createCicdPipeline,
        createEnvironment,
        createInfrastructureTemplate,
        createDockerConfig,
        createKubernetesPlan,
        createReleaseOrchestration,
        createRollbackPlan,
        createBlueGreenPlan,
        createCanaryPlan,
        createMonitoringIntegration,
        createLoggingIntegration,
        createHealthCheck,
        createBackupVerification,
        createDisasterRecoveryPlan,
        createCostEstimate,
        createDeploymentApproval,
        createReleaseVersion,
        refresh,
    };
}
