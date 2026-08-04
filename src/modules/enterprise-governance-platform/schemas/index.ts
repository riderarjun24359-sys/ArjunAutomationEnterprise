import { z } from "zod";

export const governanceHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type governanceHubsFormValues = z.infer<typeof governanceHubsFormSchema>;

export const organizationGovernanceFormSchema = z.object({
    governanceHubId: z.string().min(1),
    governanceKey: z.string().min(1).optional(),
    governanceName: z.string().min(1).optional(),
    governanceStatus: z.string().min(1).optional(),
});

export type organizationGovernanceFormValues = z.infer<typeof organizationGovernanceFormSchema>;

export const governancePoliciesFormSchema = z.object({
    governanceHubId: z.string().min(1),
    policyKey: z.string().min(1).optional(),
    policyName: z.string().min(1).optional(),
    policyStatus: z.string().min(1).optional(),
});

export type governancePoliciesFormValues = z.infer<typeof governancePoliciesFormSchema>;

export const governanceFrameworkFormSchema = z.object({
    governanceHubId: z.string().min(1),
    frameworkKey: z.string().min(1).optional(),
    frameworkName: z.string().min(1).optional(),
    frameworkStatus: z.string().min(1).optional(),
});

export type governanceFrameworkFormValues = z.infer<typeof governanceFrameworkFormSchema>;

export const governanceReviewsFormSchema = z.object({
    governanceHubId: z.string().min(1),
    reviewKey: z.string().min(1).optional(),
    reviewTitle: z.string().min(1).optional(),
    reviewStatus: z.string().min(1).optional(),
});

export type governanceReviewsFormValues = z.infer<typeof governanceReviewsFormSchema>;

export const governanceDashboardsFormSchema = z.object({
    governanceHubId: z.string().min(1),
    dashboardKey: z.string().min(1).optional(),
    dashboardName: z.string().min(1).optional(),
    dashboardStatus: z.string().min(1).optional(),
});

export type governanceDashboardsFormValues = z.infer<typeof governanceDashboardsFormSchema>;

export const complianceFrameworkFormSchema = z.object({
    governanceHubId: z.string().min(1),
    frameworkKey: z.string().min(1).optional(),
    frameworkName: z.string().min(1).optional(),
    frameworkStatus: z.string().min(1).optional(),
});

export type complianceFrameworkFormValues = z.infer<typeof complianceFrameworkFormSchema>;

export const complianceControlsFormSchema = z.object({
    governanceHubId: z.string().min(1),
    controlKey: z.string().min(1).optional(),
    controlName: z.string().min(1).optional(),
    controlStatus: z.string().min(1).optional(),
});

export type complianceControlsFormValues = z.infer<typeof complianceControlsFormSchema>;

export const complianceEvidenceFormSchema = z.object({
    governanceHubId: z.string().min(1),
    evidenceKey: z.string().min(1).optional(),
    evidenceTitle: z.string().min(1).optional(),
    evidenceStatus: z.string().min(1).optional(),
});

export type complianceEvidenceFormValues = z.infer<typeof complianceEvidenceFormSchema>;

export const complianceReportsFormSchema = z.object({
    governanceHubId: z.string().min(1),
    reportKey: z.string().min(1).optional(),
    reportTitle: z.string().min(1).optional(),
    reportStatus: z.string().min(1).optional(),
});

export type complianceReportsFormValues = z.infer<typeof complianceReportsFormSchema>;

export const complianceCalendarFormSchema = z.object({
    governanceHubId: z.string().min(1),
    calendarKey: z.string().min(1).optional(),
    calendarName: z.string().min(1).optional(),
    calendarStatus: z.string().min(1).optional(),
});

export type complianceCalendarFormValues = z.infer<typeof complianceCalendarFormSchema>;

export const auditCenterFormSchema = z.object({
    governanceHubId: z.string().min(1),
    auditKey: z.string().min(1).optional(),
    auditName: z.string().min(1).optional(),
    auditStatus: z.string().min(1).optional(),
});

export type auditCenterFormValues = z.infer<typeof auditCenterFormSchema>;

export const auditFindingsFormSchema = z.object({
    governanceHubId: z.string().min(1),
    findingKey: z.string().min(1).optional(),
    findingTitle: z.string().min(1).optional(),
    findingSeverity: z.string().min(1).optional(),
});

export type auditFindingsFormValues = z.infer<typeof auditFindingsFormSchema>;

export const correctiveActionsFormSchema = z.object({
    governanceHubId: z.string().min(1),
    actionKey: z.string().min(1).optional(),
    actionTitle: z.string().min(1).optional(),
    actionStatus: z.string().min(1).optional(),
});

export type correctiveActionsFormValues = z.infer<typeof correctiveActionsFormSchema>;

export const auditEvidenceFormSchema = z.object({
    governanceHubId: z.string().min(1),
    evidenceKey: z.string().min(1).optional(),
    evidenceTitle: z.string().min(1).optional(),
    evidenceStatus: z.string().min(1).optional(),
});

export type auditEvidenceFormValues = z.infer<typeof auditEvidenceFormSchema>;

export const auditAnalyticsFormSchema = z.object({
    governanceHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsName: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type auditAnalyticsFormValues = z.infer<typeof auditAnalyticsFormSchema>;

export const dataClassificationFormSchema = z.object({
    governanceHubId: z.string().min(1),
    classificationKey: z.string().min(1).optional(),
    classificationName: z.string().min(1).optional(),
    classificationLevel: z.string().min(1).optional(),
});

export type dataClassificationFormValues = z.infer<typeof dataClassificationFormSchema>;

export const retentionPoliciesFormSchema = z.object({
    governanceHubId: z.string().min(1),
    policyKey: z.string().min(1).optional(),
    policyName: z.string().min(1).optional(),
    policyStatus: z.string().min(1).optional(),
});

export type retentionPoliciesFormValues = z.infer<typeof retentionPoliciesFormSchema>;

export const dataLifecycleFormSchema = z.object({
    governanceHubId: z.string().min(1),
    lifecycleKey: z.string().min(1).optional(),
    lifecycleName: z.string().min(1).optional(),
    lifecycleStage: z.string().min(1).optional(),
});

export type dataLifecycleFormValues = z.infer<typeof dataLifecycleFormSchema>;

export const dataOwnershipFormSchema = z.object({
    governanceHubId: z.string().min(1),
    ownershipKey: z.string().min(1).optional(),
    ownershipName: z.string().min(1).optional(),
    ownershipStatus: z.string().min(1).optional(),
});

export type dataOwnershipFormValues = z.infer<typeof dataOwnershipFormSchema>;

export const dataQualityFormSchema = z.object({
    governanceHubId: z.string().min(1),
    qualityKey: z.string().min(1).optional(),
    qualityName: z.string().min(1).optional(),
    qualityScore: z.number().optional(),
});

export type dataQualityFormValues = z.infer<typeof dataQualityFormSchema>;

export const riskRegisterFormSchema = z.object({
    governanceHubId: z.string().min(1),
    riskKey: z.string().min(1).optional(),
    riskTitle: z.string().min(1).optional(),
    riskSeverity: z.string().min(1).optional(),
});

export type riskRegisterFormValues = z.infer<typeof riskRegisterFormSchema>;

export const riskAssessmentFormSchema = z.object({
    governanceHubId: z.string().min(1),
    assessmentKey: z.string().min(1).optional(),
    assessmentTitle: z.string().min(1).optional(),
    assessmentScore: z.number().optional(),
});

export type riskAssessmentFormValues = z.infer<typeof riskAssessmentFormSchema>;

export const riskMitigationFormSchema = z.object({
    governanceHubId: z.string().min(1),
    mitigationKey: z.string().min(1).optional(),
    mitigationTitle: z.string().min(1).optional(),
    mitigationStatus: z.string().min(1).optional(),
});

export type riskMitigationFormValues = z.infer<typeof riskMitigationFormSchema>;

export const riskMonitoringFormSchema = z.object({
    governanceHubId: z.string().min(1),
    monitoringKey: z.string().min(1).optional(),
    monitoringName: z.string().min(1).optional(),
    monitoringStatus: z.string().min(1).optional(),
});

export type riskMonitoringFormValues = z.infer<typeof riskMonitoringFormSchema>;

export const businessContinuityFormSchema = z.object({
    governanceHubId: z.string().min(1),
    continuityKey: z.string().min(1).optional(),
    continuityName: z.string().min(1).optional(),
    continuityStatus: z.string().min(1).optional(),
});

export type businessContinuityFormValues = z.infer<typeof businessContinuityFormSchema>;

export const governanceMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    overallGovernanceScore: z.number().optional(),
    complianceScore: z.number().optional(),
});

export type governanceMetricsFormValues = z.infer<typeof governanceMetricsFormSchema>;

export const governanceHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type governanceHealthFormValues = z.infer<typeof governanceHealthFormSchema>;

export const complianceDashboardsFormSchema = z.object({
    governanceHubId: z.string().min(1),
    dashboardKey: z.string().min(1).optional(),
    dashboardName: z.string().min(1).optional(),
    dashboardStatus: z.string().min(1).optional(),
});

export type complianceDashboardsFormValues = z.infer<typeof complianceDashboardsFormSchema>;

export const missionProgressFormSchema = z.object({
    governanceHubId: z.string().min(1),
    progressKey: z.string().min(1).optional(),
    progressName: z.string().min(1).optional(),
    progressPercent: z.number().optional(),
});

export type missionProgressFormValues = z.infer<typeof missionProgressFormSchema>;

export const governanceFailuresFormSchema = z.object({
    governanceHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type governanceFailuresFormValues = z.infer<typeof governanceFailuresFormSchema>;
