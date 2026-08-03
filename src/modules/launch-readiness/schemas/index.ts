import { z } from "zod";

export const readinessHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type readinessHubsFormValues = z.infer<typeof readinessHubsFormSchema>;

export const environmentValidationsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    validationKey: z.string().min(1).optional(),
    validationType: z.string().min(1).optional(),
    validationScore: z.number().optional(),
});

export type environmentValidationsFormValues = z.infer<typeof environmentValidationsFormSchema>;

export const configurationValidationsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    validationKey: z.string().min(1).optional(),
    configType: z.string().min(1).optional(),
    validationScore: z.number().optional(),
});

export type configurationValidationsFormValues = z.infer<typeof configurationValidationsFormSchema>;

export const secretsValidationsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    validationKey: z.string().min(1).optional(),
    secretType: z.string().min(1).optional(),
    validationScore: z.number().optional(),
});

export type secretsValidationsFormValues = z.infer<typeof secretsValidationsFormSchema>;

export const deploymentPlansFormSchema = z.object({
    readinessHubId: z.string().min(1),
    planKey: z.string().min(1).optional(),
    planName: z.string().min(1).optional(),
    targetVersion: z.string().min(1).optional(),
});

export type deploymentPlansFormValues = z.infer<typeof deploymentPlansFormSchema>;

export const rollbackPlansFormSchema = z.object({
    readinessHubId: z.string().min(1),
    planKey: z.string().min(1).optional(),
    rollbackVersion: z.string().min(1).optional(),
    rollbackReason: z.string().min(1).optional(),
});

export type rollbackPlansFormValues = z.infer<typeof rollbackPlansFormSchema>;

export const versionRegistryFormSchema = z.object({
    readinessHubId: z.string().min(1),
    versionKey: z.string().min(1).optional(),
    versionNumber: z.string().min(1).optional(),
    releaseChannel: z.string().min(1).optional(),
});

export type versionRegistryFormValues = z.infer<typeof versionRegistryFormSchema>;

export const releaseNotesFormSchema = z.object({
    readinessHubId: z.string().min(1),
    noteKey: z.string().min(1).optional(),
    versionRef: z.string().min(1).optional(),
    noteSummary: z.string().min(1).optional(),
});

export type releaseNotesFormValues = z.infer<typeof releaseNotesFormSchema>;

export const backupPoliciesFormSchema = z.object({
    readinessHubId: z.string().min(1),
    policyKey: z.string().min(1).optional(),
    policyName: z.string().min(1).optional(),
    retentionDays: z.number().optional(),
});

export type backupPoliciesFormValues = z.infer<typeof backupPoliciesFormSchema>;

export const backupVerificationsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    verificationKey: z.string().min(1).optional(),
    backupRef: z.string().min(1).optional(),
    verificationScore: z.number().optional(),
});

export type backupVerificationsFormValues = z.infer<typeof backupVerificationsFormSchema>;

export const restoreVerificationsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    verificationKey: z.string().min(1).optional(),
    restoreRef: z.string().min(1).optional(),
    verificationScore: z.number().optional(),
});

export type restoreVerificationsFormValues = z.infer<typeof restoreVerificationsFormSchema>;

export const recoveryDrillsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    drillKey: z.string().min(1).optional(),
    drillType: z.string().min(1).optional(),
    drillScore: z.number().optional(),
});

export type recoveryDrillsFormValues = z.infer<typeof recoveryDrillsFormSchema>;

export const observabilityLogsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    logKey: z.string().min(1).optional(),
    logLevel: z.string().min(1).optional(),
    logSource: z.string().min(1).optional(),
});

export type observabilityLogsFormValues = z.infer<typeof observabilityLogsFormSchema>;

export const observabilityMetricsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    metricKey: z.string().min(1).optional(),
    metricName: z.string().min(1).optional(),
    metricValue: z.number().optional(),
});

export type observabilityMetricsFormValues = z.infer<typeof observabilityMetricsFormSchema>;

export const traceRecordsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    traceKey: z.string().min(1).optional(),
    traceName: z.string().min(1).optional(),
    latencyMs: z.number().optional(),
});

export type traceRecordsFormValues = z.infer<typeof traceRecordsFormSchema>;

export const slaMonitorsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    monitorKey: z.string().min(1).optional(),
    slaTarget: z.number().optional(),
    currentValue: z.number().optional(),
});

export type slaMonitorsFormValues = z.infer<typeof slaMonitorsFormSchema>;

export const securityChecklistsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    checklistKey: z.string().min(1).optional(),
    checklistName: z.string().min(1).optional(),
    completionScore: z.number().optional(),
});

export type securityChecklistsFormValues = z.infer<typeof securityChecklistsFormSchema>;

export const vulnerabilityReviewsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    reviewKey: z.string().min(1).optional(),
    vulnerabilityRef: z.string().min(1).optional(),
    severity: z.string().min(1).optional(),
});

export type vulnerabilityReviewsFormValues = z.infer<typeof vulnerabilityReviewsFormSchema>;

export const permissionAuditsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    auditKey: z.string().min(1).optional(),
    auditScope: z.string().min(1).optional(),
    findingCount: z.number().optional(),
});

export type permissionAuditsFormValues = z.infer<typeof permissionAuditsFormSchema>;

export const complianceReviewsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    reviewKey: z.string().min(1).optional(),
    complianceType: z.string().min(1).optional(),
    reviewScore: z.number().optional(),
});

export type complianceReviewsFormValues = z.infer<typeof complianceReviewsFormSchema>;

export const adminGuidesFormSchema = z.object({
    readinessHubId: z.string().min(1),
    guideKey: z.string().min(1).optional(),
    guideTitle: z.string().min(1).optional(),
    guideVersion: z.string().min(1).optional(),
});

export type adminGuidesFormValues = z.infer<typeof adminGuidesFormSchema>;

export const userGuidesFormSchema = z.object({
    readinessHubId: z.string().min(1),
    guideKey: z.string().min(1).optional(),
    guideTitle: z.string().min(1).optional(),
    guideVersion: z.string().min(1).optional(),
});

export type userGuidesFormValues = z.infer<typeof userGuidesFormSchema>;

export const deploymentGuidesFormSchema = z.object({
    readinessHubId: z.string().min(1),
    guideKey: z.string().min(1).optional(),
    guideTitle: z.string().min(1).optional(),
    guideVersion: z.string().min(1).optional(),
});

export type deploymentGuidesFormValues = z.infer<typeof deploymentGuidesFormSchema>;

export const launchScoreMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    documentationScore: z.number().optional(),
    overallLaunchScore: z.number().optional(),
});

export type launchScoreMetricsFormValues = z.infer<typeof launchScoreMetricsFormSchema>;

export const readinessValidationsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    validationKey: z.string().min(1).optional(),
    validationType: z.string().min(1).optional(),
    validationScore: z.number().optional(),
});

export type readinessValidationsFormValues = z.infer<typeof readinessValidationsFormSchema>;

export const launchBlockersFormSchema = z.object({
    readinessHubId: z.string().min(1),
    blockerKey: z.string().min(1).optional(),
    blockerTitle: z.string().min(1).optional(),
    blockerSeverity: z.string().min(1).optional(),
});

export type launchBlockersFormValues = z.infer<typeof launchBlockersFormSchema>;

export const scoreSnapshotsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    snapshotKey: z.string().min(1).optional(),
    snapshotDate: z.string().min(1).optional(),
    overallLaunchScore: z.number().optional(),
});

export type scoreSnapshotsFormValues = z.infer<typeof scoreSnapshotsFormSchema>;

export const launchHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type launchHealthFormValues = z.infer<typeof launchHealthFormSchema>;

export const criticalIssuesFormSchema = z.object({
    readinessHubId: z.string().min(1),
    issueKey: z.string().min(1).optional(),
    issueTitle: z.string().min(1).optional(),
    issueSeverity: z.string().min(1).optional(),
});

export type criticalIssuesFormValues = z.infer<typeof criticalIssuesFormSchema>;

export const readinessWarningsFormSchema = z.object({
    readinessHubId: z.string().min(1),
    warningKey: z.string().min(1).optional(),
    warningType: z.string().min(1).optional(),
    warningMessage: z.string().min(1).optional(),
});

export type readinessWarningsFormValues = z.infer<typeof readinessWarningsFormSchema>;

export const launchFailuresFormSchema = z.object({
    readinessHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type launchFailuresFormValues = z.infer<typeof launchFailuresFormSchema>;
