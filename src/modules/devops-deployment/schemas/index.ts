import { z } from "zod";

export const engagementFormSchema = z.object({
    title: z.string().min(2),
    engagementKey: z.string().min(2),
    baEngagementId: z.string().optional(),
    saEngagementId: z.string().optional(),
    dfEngagementId: z.string().optional(),
    qaEngagementId: z.string().optional(),
    solutionArchitectureId: z.string().optional(),
    workPackageId: z.string().optional(),
    qaReleaseReadinessId: z.string().optional(),
    brdId: z.string().optional(),
    frsId: z.string().optional(),
    clientId: z.string().optional(),
    projectId: z.string().optional(),
    agentId: z.string().optional(),
    sessionId: z.string().optional(),
    summary: z.string().optional(),
});

export const cicdPipelineFormSchema = z.object({
    engagementId: z.string().min(1),
    pipelineKey: z.string().min(2),
    name: z.string().min(2),
    platform: z.string().optional(),
});

export const environmentFormSchema = z.object({
    engagementId: z.string().min(1),
    environmentKey: z.string().min(2),
    name: z.string().min(2),
    environmentType: z.string().optional(),
});

export const infrastructureTemplateFormSchema = z.object({
    engagementId: z.string().min(1),
    templateKey: z.string().min(2),
    name: z.string().min(2),
    provider: z.string().optional(),
    templateType: z.string().optional(),
});

export const dockerConfigFormSchema = z.object({
    engagementId: z.string().min(1),
    configKey: z.string().min(2),
    name: z.string().min(2),
    baseImage: z.string().optional(),
    dockerfileContent: z.string().optional(),
});

export const kubernetesPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    namespace: z.string().optional(),
});

export const releaseOrchestrationFormSchema = z.object({
    engagementId: z.string().min(1),
    orchestrationKey: z.string().min(2),
    name: z.string().min(2),
});

export const rollbackPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    recoveryTimeMinutes: z.number().min(1).optional(),
});

export const blueGreenPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    blueEnvironment: z.string().optional(),
    greenEnvironment: z.string().optional(),
});

export const canaryPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    canaryPercentage: z.number().min(0).max(100).optional(),
});

export const monitoringIntegrationFormSchema = z.object({
    engagementId: z.string().min(1),
    integrationKey: z.string().min(2),
    name: z.string().min(2),
    provider: z.string().optional(),
});

export const loggingIntegrationFormSchema = z.object({
    engagementId: z.string().min(1),
    integrationKey: z.string().min(2),
    name: z.string().min(2),
    provider: z.string().optional(),
    retentionDays: z.number().min(1).optional(),
});

export const healthCheckFormSchema = z.object({
    engagementId: z.string().min(1),
    checkKey: z.string().min(2),
    name: z.string().min(2),
    endpoint: z.string().optional(),
    checkIntervalSeconds: z.number().min(1).optional(),
});

export const backupVerificationFormSchema = z.object({
    engagementId: z.string().min(1),
    verificationKey: z.string().min(2),
    name: z.string().min(2),
    verificationResults: z.string().optional(),
});

export const disasterRecoveryPlanFormSchema = z.object({
    engagementId: z.string().min(1),
    planKey: z.string().min(2),
    name: z.string().min(2),
    rtoMinutes: z.number().min(1).optional(),
    rpoMinutes: z.number().min(1).optional(),
});

export const costEstimateFormSchema = z.object({
    engagementId: z.string().min(1),
    estimateKey: z.string().min(2),
    name: z.string().min(2),
    monthlyCostUsd: z.number().min(0).optional(),
});

export const deploymentApprovalFormSchema = z.object({
    engagementId: z.string().min(1),
    approvalKey: z.string().min(2),
    title: z.string().min(2),
    approverRole: z.string().optional(),
});

export const releaseVersionFormSchema = z.object({
    engagementId: z.string().min(1),
    versionKey: z.string().min(2),
    versionNumber: z.string().min(1),
    releaseNotes: z.string().optional(),
});

export type EngagementFormValues = z.infer<typeof engagementFormSchema>;
export type CicdPipelineFormValues = z.infer<typeof cicdPipelineFormSchema>;
export type EnvironmentFormValues = z.infer<typeof environmentFormSchema>;
export type InfrastructureTemplateFormValues = z.infer<typeof infrastructureTemplateFormSchema>;
export type DockerConfigFormValues = z.infer<typeof dockerConfigFormSchema>;
export type KubernetesPlanFormValues = z.infer<typeof kubernetesPlanFormSchema>;
export type ReleaseOrchestrationFormValues = z.infer<typeof releaseOrchestrationFormSchema>;
export type RollbackPlanFormValues = z.infer<typeof rollbackPlanFormSchema>;
export type BlueGreenPlanFormValues = z.infer<typeof blueGreenPlanFormSchema>;
export type CanaryPlanFormValues = z.infer<typeof canaryPlanFormSchema>;
export type MonitoringIntegrationFormValues = z.infer<typeof monitoringIntegrationFormSchema>;
export type LoggingIntegrationFormValues = z.infer<typeof loggingIntegrationFormSchema>;
export type HealthCheckFormValues = z.infer<typeof healthCheckFormSchema>;
export type BackupVerificationFormValues = z.infer<typeof backupVerificationFormSchema>;
export type DisasterRecoveryPlanFormValues = z.infer<typeof disasterRecoveryPlanFormSchema>;
export type CostEstimateFormValues = z.infer<typeof costEstimateFormSchema>;
export type DeploymentApprovalFormValues = z.infer<typeof deploymentApprovalFormSchema>;
export type ReleaseVersionFormValues = z.infer<typeof releaseVersionFormSchema>;
