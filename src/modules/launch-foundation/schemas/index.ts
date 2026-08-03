import { z } from "zod";

export const launchHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type launchHubsFormValues = z.infer<typeof launchHubsFormSchema>;

export const organizationProvisionsFormSchema = z.object({
    launchHubId: z.string().min(1),
    provisionKey: z.string().min(1).optional(),
    provisionName: z.string().min(1).optional(),
    provisionStatus: z.string().min(1).optional(),
});

export type organizationProvisionsFormValues = z.infer<typeof organizationProvisionsFormSchema>;

export const tenantProvisionsFormSchema = z.object({
    launchHubId: z.string().min(1),
    provisionKey: z.string().min(1).optional(),
    tenantRef: z.string().min(1).optional(),
    provisionStatus: z.string().min(1).optional(),
});

export type tenantProvisionsFormValues = z.infer<typeof tenantProvisionsFormSchema>;

export const industryPackAssignmentsFormSchema = z.object({
    launchHubId: z.string().min(1),
    assignmentKey: z.string().min(1).optional(),
    packName: z.string().min(1).optional(),
    packType: z.string().min(1).optional(),
});

export type industryPackAssignmentsFormValues = z.infer<typeof industryPackAssignmentsFormSchema>;

export const moduleLicensesFormSchema = z.object({
    launchHubId: z.string().min(1),
    licenseKey: z.string().min(1).optional(),
    moduleName: z.string().min(1).optional(),
    licenseStatus: z.string().min(1).optional(),
});

export type moduleLicensesFormValues = z.infer<typeof moduleLicensesFormSchema>;

export const wizardProfilesFormSchema = z.object({
    launchHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    profileType: z.string().min(1).optional(),
});

export type wizardProfilesFormValues = z.infer<typeof wizardProfilesFormSchema>;

export const wizardBrandingFormSchema = z.object({
    launchHubId: z.string().min(1),
    brandingKey: z.string().min(1).optional(),
    brandingName: z.string().min(1).optional(),
    brandColor: z.string().min(1).optional(),
});

export type wizardBrandingFormValues = z.infer<typeof wizardBrandingFormSchema>;

export const wizardDepartmentsFormSchema = z.object({
    launchHubId: z.string().min(1),
    departmentKey: z.string().min(1).optional(),
    departmentName: z.string().min(1).optional(),
    departmentType: z.string().min(1).optional(),
});

export type wizardDepartmentsFormValues = z.infer<typeof wizardDepartmentsFormSchema>;

export const wizardSettingsFormSchema = z.object({
    launchHubId: z.string().min(1),
    settingKey: z.string().min(1).optional(),
    settingName: z.string().min(1).optional(),
    settingValue: z.string().min(1).optional(),
});

export type wizardSettingsFormValues = z.infer<typeof wizardSettingsFormSchema>;

export const importJobsFormSchema = z.object({
    launchHubId: z.string().min(1),
    jobKey: z.string().min(1).optional(),
    jobName: z.string().min(1).optional(),
    jobStatus: z.string().min(1).optional(),
});

export type importJobsFormValues = z.infer<typeof importJobsFormSchema>;

export const importValidationsFormSchema = z.object({
    launchHubId: z.string().min(1),
    validationKey: z.string().min(1).optional(),
    validationType: z.string().min(1).optional(),
    validationScore: z.number().optional(),
});

export type importValidationsFormValues = z.infer<typeof importValidationsFormSchema>;

export const importPreviewsFormSchema = z.object({
    launchHubId: z.string().min(1),
    previewKey: z.string().min(1).optional(),
    previewName: z.string().min(1).optional(),
    recordCount: z.number().optional(),
});

export type importPreviewsFormValues = z.infer<typeof importPreviewsFormSchema>;

export const importHistoryFormSchema = z.object({
    launchHubId: z.string().min(1),
    historyKey: z.string().min(1).optional(),
    historyType: z.string().min(1).optional(),
    importedAt: z.string().min(1).optional(),
});

export type importHistoryFormValues = z.infer<typeof importHistoryFormSchema>;

export const goLiveChecklistsFormSchema = z.object({
    launchHubId: z.string().min(1),
    checklistKey: z.string().min(1).optional(),
    checklistName: z.string().min(1).optional(),
    completionScore: z.number().optional(),
});

export type goLiveChecklistsFormValues = z.infer<typeof goLiveChecklistsFormSchema>;

export const goLiveScoresFormSchema = z.object({
    launchHubId: z.string().min(1),
    scoreKey: z.string().min(1).optional(),
    scoreType: z.string().min(1).optional(),
    goLiveScore: z.number().optional(),
});

export type goLiveScoresFormValues = z.infer<typeof goLiveScoresFormSchema>;

export const deploymentStatusesFormSchema = z.object({
    launchHubId: z.string().min(1),
    statusKey: z.string().min(1).optional(),
    deploymentName: z.string().min(1).optional(),
    deploymentStatus: z.string().min(1).optional(),
});

export type deploymentStatusesFormValues = z.infer<typeof deploymentStatusesFormSchema>;

export const readinessValidationsFormSchema = z.object({
    launchHubId: z.string().min(1),
    validationKey: z.string().min(1).optional(),
    validationType: z.string().min(1).optional(),
    validationScore: z.number().optional(),
});

export type readinessValidationsFormValues = z.infer<typeof readinessValidationsFormSchema>;

export const customerHealthScoresFormSchema = z.object({
    launchHubId: z.string().min(1),
    scoreKey: z.string().min(1).optional(),
    customerRef: z.string().min(1).optional(),
    healthScore: z.number().optional(),
});

export type customerHealthScoresFormValues = z.infer<typeof customerHealthScoresFormSchema>;

export const platformAdoptionFormSchema = z.object({
    launchHubId: z.string().min(1),
    adoptionKey: z.string().min(1).optional(),
    featureName: z.string().min(1).optional(),
    adoptionRate: z.number().optional(),
});

export type platformAdoptionFormValues = z.infer<typeof platformAdoptionFormSchema>;

export const featureUsageFormSchema = z.object({
    launchHubId: z.string().min(1),
    usageKey: z.string().min(1).optional(),
    featureName: z.string().min(1).optional(),
    usageCount: z.number().optional(),
});

export type featureUsageFormValues = z.infer<typeof featureUsageFormSchema>;

export const renewalTrackingFormSchema = z.object({
    launchHubId: z.string().min(1),
    renewalKey: z.string().min(1).optional(),
    customerRef: z.string().min(1).optional(),
    renewalStatus: z.string().min(1).optional(),
});

export type renewalTrackingFormValues = z.infer<typeof renewalTrackingFormSchema>;

export const supportTicketsFormSchema = z.object({
    launchHubId: z.string().min(1),
    ticketKey: z.string().min(1).optional(),
    ticketTitle: z.string().min(1).optional(),
    ticketStatus: z.string().min(1).optional(),
});

export type supportTicketsFormValues = z.infer<typeof supportTicketsFormSchema>;

export const knowledgeBaseArticlesFormSchema = z.object({
    launchHubId: z.string().min(1),
    articleKey: z.string().min(1).optional(),
    articleTitle: z.string().min(1).optional(),
    articleCategory: z.string().min(1).optional(),
});

export type knowledgeBaseArticlesFormValues = z.infer<typeof knowledgeBaseArticlesFormSchema>;

export const incidentTrackingFormSchema = z.object({
    launchHubId: z.string().min(1),
    incidentKey: z.string().min(1).optional(),
    incidentTitle: z.string().min(1).optional(),
    incidentSeverity: z.string().min(1).optional(),
});

export type incidentTrackingFormValues = z.infer<typeof incidentTrackingFormSchema>;

export const customerRegistryFormSchema = z.object({
    launchHubId: z.string().min(1),
    customerKey: z.string().min(1).optional(),
    customerName: z.string().min(1).optional(),
    customerTier: z.string().min(1).optional(),
});

export type customerRegistryFormValues = z.infer<typeof customerRegistryFormSchema>;

export const subscriptionRecordsFormSchema = z.object({
    launchHubId: z.string().min(1),
    subscriptionKey: z.string().min(1).optional(),
    planName: z.string().min(1).optional(),
    subscriptionStatus: z.string().min(1).optional(),
});

export type subscriptionRecordsFormValues = z.infer<typeof subscriptionRecordsFormSchema>;

export const licenseManagementFormSchema = z.object({
    launchHubId: z.string().min(1),
    licenseKey: z.string().min(1).optional(),
    licenseType: z.string().min(1).optional(),
    licenseStatus: z.string().min(1).optional(),
});

export type licenseManagementFormValues = z.infer<typeof licenseManagementFormSchema>;

export const launchMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    platformHealthScore: z.number().optional(),
    overallLaunchScore: z.number().optional(),
});

export type launchMetricsFormValues = z.infer<typeof launchMetricsFormSchema>;

export const launchHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type launchHealthFormValues = z.infer<typeof launchHealthFormSchema>;

export const missionControlKpisFormSchema = z.object({
    launchHubId: z.string().min(1),
    kpiKey: z.string().min(1).optional(),
    kpiName: z.string().min(1).optional(),
    kpiScore: z.number().optional(),
});

export type missionControlKpisFormValues = z.infer<typeof missionControlKpisFormSchema>;

export const launchFailuresFormSchema = z.object({
    launchHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type launchFailuresFormValues = z.infer<typeof launchFailuresFormSchema>;
