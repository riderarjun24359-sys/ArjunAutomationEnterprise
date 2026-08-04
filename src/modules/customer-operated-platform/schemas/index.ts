import { z } from "zod";

export const operatedHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type operatedHubsFormValues = z.infer<typeof operatedHubsFormSchema>;

export const signupFlowsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    flowKey: z.string().min(1).optional(),
    flowName: z.string().min(1).optional(),
    flowStatus: z.string().min(1).optional(),
});

export type signupFlowsFormValues = z.infer<typeof signupFlowsFormSchema>;

export const orgProvisioningFormSchema = z.object({
    operatedHubId: z.string().min(1),
    provisionKey: z.string().min(1).optional(),
    provisionName: z.string().min(1).optional(),
    provisionStatus: z.string().min(1).optional(),
});

export type orgProvisioningFormValues = z.infer<typeof orgProvisioningFormSchema>;

export const domainOnboardingFormSchema = z.object({
    operatedHubId: z.string().min(1),
    domainKey: z.string().min(1).optional(),
    domainName: z.string().min(1).optional(),
    domainStatus: z.string().min(1).optional(),
});

export type domainOnboardingFormValues = z.infer<typeof domainOnboardingFormSchema>;

export const emailVerificationsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    verificationKey: z.string().min(1).optional(),
    emailAddress: z.string().min(1).optional(),
    verificationStatus: z.string().min(1).optional(),
});

export type emailVerificationsFormValues = z.infer<typeof emailVerificationsFormSchema>;

export const onboardingWizardsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    wizardKey: z.string().min(1).optional(),
    wizardName: z.string().min(1).optional(),
    wizardStatus: z.string().min(1).optional(),
});

export type onboardingWizardsFormValues = z.infer<typeof onboardingWizardsFormSchema>;

export const productionProfilesFormSchema = z.object({
    operatedHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    profileStatus: z.string().min(1).optional(),
});

export type productionProfilesFormValues = z.infer<typeof productionProfilesFormSchema>;

export const deploymentJobsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    jobKey: z.string().min(1).optional(),
    jobName: z.string().min(1).optional(),
    jobStatus: z.string().min(1).optional(),
});

export type deploymentJobsFormValues = z.infer<typeof deploymentJobsFormSchema>;

export const healthValidationsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    validationKey: z.string().min(1).optional(),
    validationName: z.string().min(1).optional(),
    validationStatus: z.string().min(1).optional(),
});

export type healthValidationsFormValues = z.infer<typeof healthValidationsFormSchema>;

export const rollbackAutomationsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    rollbackKey: z.string().min(1).optional(),
    rollbackName: z.string().min(1).optional(),
    rollbackStatus: z.string().min(1).optional(),
});

export type rollbackAutomationsFormValues = z.infer<typeof rollbackAutomationsFormSchema>;

export const deploymentAuditsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    auditKey: z.string().min(1).optional(),
    auditName: z.string().min(1).optional(),
    auditStatus: z.string().min(1).optional(),
});

export type deploymentAuditsFormValues = z.infer<typeof deploymentAuditsFormSchema>;

export const centralLogsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    logKey: z.string().min(1).optional(),
    logSource: z.string().min(1).optional(),
    logLevel: z.string().min(1).optional(),
});

export type centralLogsFormValues = z.infer<typeof centralLogsFormSchema>;

export const metricsCollectorsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    collectorKey: z.string().min(1).optional(),
    collectorName: z.string().min(1).optional(),
    collectorStatus: z.string().min(1).optional(),
});

export type metricsCollectorsFormValues = z.infer<typeof metricsCollectorsFormSchema>;

export const distributedTracesFormSchema = z.object({
    operatedHubId: z.string().min(1),
    traceKey: z.string().min(1).optional(),
    traceName: z.string().min(1).optional(),
    traceStatus: z.string().min(1).optional(),
});

export type distributedTracesFormValues = z.infer<typeof distributedTracesFormSchema>;

export const alertRulesFormSchema = z.object({
    operatedHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    severity: z.string().min(1).optional(),
});

export type alertRulesFormValues = z.infer<typeof alertRulesFormSchema>;

export const incidentTimelinesFormSchema = z.object({
    operatedHubId: z.string().min(1),
    incidentKey: z.string().min(1).optional(),
    incidentTitle: z.string().min(1).optional(),
    incidentStatus: z.string().min(1).optional(),
});

export type incidentTimelinesFormValues = z.infer<typeof incidentTimelinesFormSchema>;

export const backupSchedulersFormSchema = z.object({
    operatedHubId: z.string().min(1),
    scheduleKey: z.string().min(1).optional(),
    scheduleName: z.string().min(1).optional(),
    scheduleStatus: z.string().min(1).optional(),
});

export type backupSchedulersFormValues = z.infer<typeof backupSchedulersFormSchema>;

export const restoreValidationsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    restoreKey: z.string().min(1).optional(),
    restoreName: z.string().min(1).optional(),
    restoreStatus: z.string().min(1).optional(),
});

export type restoreValidationsFormValues = z.infer<typeof restoreValidationsFormSchema>;

export const maintenanceModesFormSchema = z.object({
    operatedHubId: z.string().min(1),
    maintenanceKey: z.string().min(1).optional(),
    maintenanceName: z.string().min(1).optional(),
    maintenanceStatus: z.string().min(1).optional(),
});

export type maintenanceModesFormValues = z.infer<typeof maintenanceModesFormSchema>;

export const featureFlagOpsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    flagKey: z.string().min(1).optional(),
    flagName: z.string().min(1).optional(),
    flagStatus: z.string().min(1).optional(),
});

export type featureFlagOpsFormValues = z.infer<typeof featureFlagOpsFormSchema>;

export const platformDiagnosticsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    diagnosticKey: z.string().min(1).optional(),
    diagnosticName: z.string().min(1).optional(),
    diagnosticStatus: z.string().min(1).optional(),
});

export type platformDiagnosticsFormValues = z.infer<typeof platformDiagnosticsFormSchema>;

export const betaOrganizationsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    orgKey: z.string().min(1).optional(),
    orgName: z.string().min(1).optional(),
    betaStatus: z.string().min(1).optional(),
});

export type betaOrganizationsFormValues = z.infer<typeof betaOrganizationsFormSchema>;

export const betaInvitationsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    invitationKey: z.string().min(1).optional(),
    inviteeEmail: z.string().min(1).optional(),
    invitationStatus: z.string().min(1).optional(),
});

export type betaInvitationsFormValues = z.infer<typeof betaInvitationsFormSchema>;

export const feedbackCollectionFormSchema = z.object({
    operatedHubId: z.string().min(1),
    feedbackKey: z.string().min(1).optional(),
    feedbackTitle: z.string().min(1).optional(),
    feedbackType: z.string().min(1).optional(),
});

export type feedbackCollectionFormValues = z.infer<typeof feedbackCollectionFormSchema>;

export const featureRequestsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    requestKey: z.string().min(1).optional(),
    requestTitle: z.string().min(1).optional(),
    requestStatus: z.string().min(1).optional(),
});

export type featureRequestsFormValues = z.infer<typeof featureRequestsFormSchema>;

export const bugReportsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    bugKey: z.string().min(1).optional(),
    bugTitle: z.string().min(1).optional(),
    bugStatus: z.string().min(1).optional(),
});

export type bugReportsFormValues = z.infer<typeof bugReportsFormSchema>;

export const releaseChannelsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    channelKey: z.string().min(1).optional(),
    channelName: z.string().min(1).optional(),
    channelStatus: z.string().min(1).optional(),
});

export type releaseChannelsFormValues = z.infer<typeof releaseChannelsFormSchema>;

export const operatedMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    productionStatusScore: z.number().optional(),
    overallOperatedScore: z.number().optional(),
});

export type operatedMetricsFormValues = z.infer<typeof operatedMetricsFormSchema>;

export const operatedHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type operatedHealthFormValues = z.infer<typeof operatedHealthFormSchema>;

export const executiveBriefingsFormSchema = z.object({
    operatedHubId: z.string().min(1),
    briefingKey: z.string().min(1).optional(),
    briefingTitle: z.string().min(1).optional(),
    briefingType: z.string().min(1).optional(),
});

export type executiveBriefingsFormValues = z.infer<typeof executiveBriefingsFormSchema>;

export const platformFailuresFormSchema = z.object({
    operatedHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type platformFailuresFormValues = z.infer<typeof platformFailuresFormSchema>;
