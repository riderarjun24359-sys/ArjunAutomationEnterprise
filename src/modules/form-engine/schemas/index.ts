import { z } from "zod";

export const formHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type formHubsFormValues = z.infer<typeof formHubsFormSchema>;

export const formDefinitionsFormSchema = z.object({
    formHubId: z.string().min(1),
    formKey: z.string().min(1).optional(),
    formName: z.string().min(1).optional(),
    formType: z.string().min(1).optional(),
});

export type formDefinitionsFormValues = z.infer<typeof formDefinitionsFormSchema>;

export const formCategoriesFormSchema = z.object({
    formHubId: z.string().min(1),
    categoryKey: z.string().min(1).optional(),
    categoryName: z.string().min(1).optional(),
    categoryType: z.string().min(1).optional(),
});

export type formCategoriesFormValues = z.infer<typeof formCategoriesFormSchema>;

export const formVersionsFormSchema = z.object({
    formHubId: z.string().min(1),
    versionKey: z.string().min(1).optional(),
    versionNumber: z.string().min(1).optional(),
    releaseChannel: z.string().min(1).optional(),
});

export type formVersionsFormValues = z.infer<typeof formVersionsFormSchema>;

export const formDependenciesFormSchema = z.object({
    formHubId: z.string().min(1),
    dependencyKey: z.string().min(1).optional(),
    dependencyType: z.string().min(1).optional(),
    dependencyRef: z.string().min(1).optional(),
});

export type formDependenciesFormValues = z.infer<typeof formDependenciesFormSchema>;

export const formSectionsFormSchema = z.object({
    formHubId: z.string().min(1),
    sectionKey: z.string().min(1).optional(),
    sectionName: z.string().min(1).optional(),
    sectionOrder: z.number().optional(),
});

export type formSectionsFormValues = z.infer<typeof formSectionsFormSchema>;

export const formTabsFormSchema = z.object({
    formHubId: z.string().min(1),
    tabKey: z.string().min(1).optional(),
    tabName: z.string().min(1).optional(),
    tabOrder: z.number().optional(),
});

export type formTabsFormValues = z.infer<typeof formTabsFormSchema>;

export const formGroupsFormSchema = z.object({
    formHubId: z.string().min(1),
    groupKey: z.string().min(1).optional(),
    groupName: z.string().min(1).optional(),
    groupOrder: z.number().optional(),
});

export type formGroupsFormValues = z.infer<typeof formGroupsFormSchema>;

export const repeatableSectionsFormSchema = z.object({
    formHubId: z.string().min(1),
    sectionKey: z.string().min(1).optional(),
    sectionName: z.string().min(1).optional(),
    minInstances: z.number().optional(),
});

export type repeatableSectionsFormValues = z.infer<typeof repeatableSectionsFormSchema>;

export const formFieldsFormSchema = z.object({
    formHubId: z.string().min(1),
    fieldKey: z.string().min(1).optional(),
    fieldName: z.string().min(1).optional(),
    fieldType: z.string().min(1).optional(),
});

export type formFieldsFormValues = z.infer<typeof formFieldsFormSchema>;

export const fieldOptionsFormSchema = z.object({
    formHubId: z.string().min(1),
    optionKey: z.string().min(1).optional(),
    optionLabel: z.string().min(1).optional(),
    optionValue: z.string().min(1).optional(),
});

export type fieldOptionsFormValues = z.infer<typeof fieldOptionsFormSchema>;

export const formulaFieldsFormSchema = z.object({
    formHubId: z.string().min(1),
    formulaKey: z.string().min(1).optional(),
    formulaName: z.string().min(1).optional(),
    formulaExpression: z.string().min(1).optional(),
});

export type formulaFieldsFormValues = z.infer<typeof formulaFieldsFormSchema>;

export const mediaFieldsFormSchema = z.object({
    formHubId: z.string().min(1),
    mediaKey: z.string().min(1).optional(),
    mediaName: z.string().min(1).optional(),
    mediaType: z.string().min(1).optional(),
});

export type mediaFieldsFormValues = z.infer<typeof mediaFieldsFormSchema>;

export const requiredRulesFormSchema = z.object({
    formHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    fieldRef: z.string().min(1).optional(),
});

export type requiredRulesFormValues = z.infer<typeof requiredRulesFormSchema>;

export const regexRulesFormSchema = z.object({
    formHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    pattern: z.string().min(1).optional(),
});

export type regexRulesFormValues = z.infer<typeof regexRulesFormSchema>;

export const rangeRulesFormSchema = z.object({
    formHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    minValue: z.number().optional(),
});

export type rangeRulesFormValues = z.infer<typeof rangeRulesFormSchema>;

export const crossFieldRulesFormSchema = z.object({
    formHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    ruleExpression: z.string().min(1).optional(),
});

export type crossFieldRulesFormValues = z.infer<typeof crossFieldRulesFormSchema>;

export const formDraftsFormSchema = z.object({
    formHubId: z.string().min(1),
    draftKey: z.string().min(1).optional(),
    draftName: z.string().min(1).optional(),
    draftStatus: z.string().min(1).optional(),
});

export type formDraftsFormValues = z.infer<typeof formDraftsFormSchema>;

export const formSubmissionsFormSchema = z.object({
    formHubId: z.string().min(1),
    submissionKey: z.string().min(1).optional(),
    submissionName: z.string().min(1).optional(),
    submissionStatus: z.string().min(1).optional(),
});

export type formSubmissionsFormValues = z.infer<typeof formSubmissionsFormSchema>;

export const formReviewsFormSchema = z.object({
    formHubId: z.string().min(1),
    reviewKey: z.string().min(1).optional(),
    reviewName: z.string().min(1).optional(),
    reviewStatus: z.string().min(1).optional(),
});

export type formReviewsFormValues = z.infer<typeof formReviewsFormSchema>;

export const executionAuditEntriesFormSchema = z.object({
    formHubId: z.string().min(1),
    auditKey: z.string().min(1).optional(),
    auditType: z.string().min(1).optional(),
    auditSummary: z.string().min(1).optional(),
});

export type executionAuditEntriesFormValues = z.infer<typeof executionAuditEntriesFormSchema>;

export const renderProfilesFormSchema = z.object({
    formHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    profileType: z.string().min(1).optional(),
});

export type renderProfilesFormValues = z.infer<typeof renderProfilesFormSchema>;

export const themeConfigsFormSchema = z.object({
    formHubId: z.string().min(1),
    themeKey: z.string().min(1).optional(),
    themeName: z.string().min(1).optional(),
    primaryColor: z.string().min(1).optional(),
});

export type themeConfigsFormValues = z.infer<typeof themeConfigsFormSchema>;

export const localizationPacksFormSchema = z.object({
    formHubId: z.string().min(1),
    localeKey: z.string().min(1).optional(),
    localeCode: z.string().min(1).optional(),
    localeName: z.string().min(1).optional(),
});

export type localizationPacksFormValues = z.infer<typeof localizationPacksFormSchema>;

export const submissionAnalyticsFormSchema = z.object({
    formHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type submissionAnalyticsFormValues = z.infer<typeof submissionAnalyticsFormSchema>;

export const completionMetricsFormSchema = z.object({
    formHubId: z.string().min(1),
    metricKey: z.string().min(1).optional(),
    metricName: z.string().min(1).optional(),
    completionRate: z.number().optional(),
});

export type completionMetricsFormValues = z.infer<typeof completionMetricsFormSchema>;

export const usageTrendsFormSchema = z.object({
    formHubId: z.string().min(1),
    trendKey: z.string().min(1).optional(),
    trendName: z.string().min(1).optional(),
    trendValue: z.number().optional(),
});

export type usageTrendsFormValues = z.infer<typeof usageTrendsFormSchema>;

export const formMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    submissionCount: z.number().optional(),
    overallFormScore: z.number().optional(),
});

export type formMetricsFormValues = z.infer<typeof formMetricsFormSchema>;

export const formHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type formHealthFormValues = z.infer<typeof formHealthFormSchema>;

export const pendingReviewItemsFormSchema = z.object({
    formHubId: z.string().min(1),
    itemKey: z.string().min(1).optional(),
    itemName: z.string().min(1).optional(),
    reviewType: z.string().min(1).optional(),
});

export type pendingReviewItemsFormValues = z.infer<typeof pendingReviewItemsFormSchema>;

export const formFailuresFormSchema = z.object({
    formHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type formFailuresFormValues = z.infer<typeof formFailuresFormSchema>;
