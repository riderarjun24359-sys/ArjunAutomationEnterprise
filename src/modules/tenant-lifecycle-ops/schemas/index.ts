import { z } from "zod";

export const tenantContextFormSchema = z.object({
    contextKey: z.string().min(2),
    companyName: z.string().min(2),
    lifecycleStage: z.string().min(2).optional(),
});

export const lifecycleRecordFormSchema = z.object({
    tenantContextId: z.string().min(1),
    recordKey: z.string().min(2),
    currentStage: z.string().min(2).optional(),
});

export const lifecycleTransitionFormSchema = z.object({
    tenantContextId: z.string().min(1),
    transitionKey: z.string().min(2),
    fromStage: z.string().min(2).optional(),
    toStage: z.string().min(2).optional(),
});

export const lifecycleEventFormSchema = z.object({
    tenantContextId: z.string().min(1),
    eventKey: z.string().min(2),
    eventType: z.string().min(2).optional(),
    summary: z.string().min(2).optional(),
});

export const reactivationRequestFormSchema = z.object({
    tenantContextId: z.string().min(1),
    requestKey: z.string().min(2),
    targetStage: z.string().min(2).optional(),
});

export const workspaceFormSchema = z.object({
    tenantContextId: z.string().min(1),
    workspaceKey: z.string().min(2),
    workspaceName: z.string().min(2).optional(),
});

export const environmentSettingFormSchema = z.object({
    tenantContextId: z.string().min(1),
    settingKey: z.string().min(2),
    environmentName: z.string().min(2).optional(),
});

export const storageManagementFormSchema = z.object({
    tenantContextId: z.string().min(1),
    storageKey: z.string().min(2),
    storageType: z.string().min(2).optional(),
});

export const operationsControlFormSchema = z.object({
    tenantContextId: z.string().min(1),
    controlKey: z.string().min(2),
});

export const onboardingFlowFormSchema = z.object({
    tenantContextId: z.string().min(1),
    flowKey: z.string().min(2),
    flowName: z.string().min(2).optional(),
});

export const onboardingProgressFormSchema = z.object({
    tenantContextId: z.string().min(1),
    progressKey: z.string().min(2),
    currentStep: z.string().min(2).optional(),
});

export const onboardingValidationFormSchema = z.object({
    tenantContextId: z.string().min(1),
    validationKey: z.string().min(2),
    ruleName: z.string().min(2).optional(),
});

export const goLiveChecklistFormSchema = z.object({
    tenantContextId: z.string().min(1),
    checklistKey: z.string().min(2),
    name: z.string().min(2).optional(),
});

export const marketplaceModuleFormSchema = z.object({
    tenantContextId: z.string().min(1),
    moduleKey: z.string().min(2),
    moduleName: z.string().min(2).optional(),
});

export const moduleInstallationFormSchema = z.object({
    tenantContextId: z.string().min(1),
    installationKey: z.string().min(2),
});

export const moduleDependencyFormSchema = z.object({
    tenantContextId: z.string().min(1),
    dependencyKey: z.string().min(2),
});

export const moduleCompatibilityFormSchema = z.object({
    tenantContextId: z.string().min(1),
    compatibilityKey: z.string().min(2),
});

export const industryPackFormSchema = z.object({
    tenantContextId: z.string().min(1),
    packKey: z.string().min(2),
    packName: z.string().min(2).optional(),
    industry: z.string().min(2).optional(),
});

export const packInstallationFormSchema = z.object({
    tenantContextId: z.string().min(1),
    installationKey: z.string().min(2),
});

export const packVersionFormSchema = z.object({
    tenantContextId: z.string().min(1),
    versionKey: z.string().min(2),
    versionNumber: z.string().min(2).optional(),
});

export const packExportFormSchema = z.object({
    tenantContextId: z.string().min(1),
    exportKey: z.string().min(2),
});

export const healthSnapshotFormSchema = z.object({
    tenantContextId: z.string().min(1),
    snapshotKey: z.string().min(2),
    overallScore: z.number().optional(),
});

export const healthDimensionFormSchema = z.object({
    tenantContextId: z.string().min(1),
    dimensionKey: z.string().min(2),
    dimensionName: z.string().min(2).optional(),
});

export const healthRiskFormSchema = z.object({
    tenantContextId: z.string().min(1),
    riskKey: z.string().min(2),
    title: z.string().min(2).optional(),
    severity: z.string().min(2).optional(),
});

export const healthScoreFormSchema = z.object({
    tenantContextId: z.string().min(1),
    scoreKey: z.string().min(2),
    scoreValue: z.number().optional(),
});

export const successPlanFormSchema = z.object({
    tenantContextId: z.string().min(1),
    planKey: z.string().min(2),
    planName: z.string().min(2).optional(),
});

export const quarterlyReviewFormSchema = z.object({
    tenantContextId: z.string().min(1),
    reviewKey: z.string().min(2),
    quarter: z.string().min(2).optional(),
});

export const renewalPlanFormSchema = z.object({
    tenantContextId: z.string().min(1),
    renewalKey: z.string().min(2),
});

export const customerMilestoneFormSchema = z.object({
    tenantContextId: z.string().min(1),
    milestoneKey: z.string().min(2),
    milestoneName: z.string().min(2).optional(),
});

export const commercialMetricFormSchema = z.object({
    metricsKey: z.string().min(2),
    totalTenants: z.number().optional(),
});

export const growthSnapshotFormSchema = z.object({
    snapshotKey: z.string().min(2),
    growthRatePercent: z.number().optional(),
});

export const expansionOpportunityFormSchema = z.object({
    tenantContextId: z.string().min(1),
    opportunityKey: z.string().min(2),
    title: z.string().min(2).optional(),
});

export type tenantContextFormValues = z.infer<typeof tenantContextFormSchema>;
export type lifecycleRecordFormValues = z.infer<typeof lifecycleRecordFormSchema>;
export type lifecycleTransitionFormValues = z.infer<typeof lifecycleTransitionFormSchema>;
export type lifecycleEventFormValues = z.infer<typeof lifecycleEventFormSchema>;
export type reactivationRequestFormValues = z.infer<typeof reactivationRequestFormSchema>;
export type workspaceFormValues = z.infer<typeof workspaceFormSchema>;
export type environmentSettingFormValues = z.infer<typeof environmentSettingFormSchema>;
export type storageManagementFormValues = z.infer<typeof storageManagementFormSchema>;
export type operationsControlFormValues = z.infer<typeof operationsControlFormSchema>;
export type onboardingFlowFormValues = z.infer<typeof onboardingFlowFormSchema>;
export type onboardingProgressFormValues = z.infer<typeof onboardingProgressFormSchema>;
export type onboardingValidationFormValues = z.infer<typeof onboardingValidationFormSchema>;
export type goLiveChecklistFormValues = z.infer<typeof goLiveChecklistFormSchema>;
export type marketplaceModuleFormValues = z.infer<typeof marketplaceModuleFormSchema>;
export type moduleInstallationFormValues = z.infer<typeof moduleInstallationFormSchema>;
export type moduleDependencyFormValues = z.infer<typeof moduleDependencyFormSchema>;
export type moduleCompatibilityFormValues = z.infer<typeof moduleCompatibilityFormSchema>;
export type industryPackFormValues = z.infer<typeof industryPackFormSchema>;
export type packInstallationFormValues = z.infer<typeof packInstallationFormSchema>;
export type packVersionFormValues = z.infer<typeof packVersionFormSchema>;
export type packExportFormValues = z.infer<typeof packExportFormSchema>;
export type healthSnapshotFormValues = z.infer<typeof healthSnapshotFormSchema>;
export type healthDimensionFormValues = z.infer<typeof healthDimensionFormSchema>;
export type healthRiskFormValues = z.infer<typeof healthRiskFormSchema>;
export type healthScoreFormValues = z.infer<typeof healthScoreFormSchema>;
export type successPlanFormValues = z.infer<typeof successPlanFormSchema>;
export type quarterlyReviewFormValues = z.infer<typeof quarterlyReviewFormSchema>;
export type renewalPlanFormValues = z.infer<typeof renewalPlanFormSchema>;
export type customerMilestoneFormValues = z.infer<typeof customerMilestoneFormSchema>;
export type commercialMetricFormValues = z.infer<typeof commercialMetricFormSchema>;
export type growthSnapshotFormValues = z.infer<typeof growthSnapshotFormSchema>;
export type expansionOpportunityFormValues = z.infer<typeof expansionOpportunityFormSchema>;
