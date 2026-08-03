export interface DfeDashboardStats {
    totalFormHubs: number;
    activeFormHubs: number;
    formSectionCount: number;
    requiredRuleCount: number;
    formSubmissionCount: number;
    openPendingReviewCount: number;
    openFailureCount: number;
    overallFormScore: number;
    submissionCountScore: number;
    completionRateScore: number;
    validationErrorScore: number;
    abandonmentRateScore: number;
    averageCompletionTimeScore: number;
    auditCount: number;
}

export interface DfePipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface DfeSdkRegisterFormInput { formHubId: string; formKey?: string; formName?: string; }
export interface DfeSdkRegisterFormResult { formId: string; formKey: string; status: string; }
export interface DfeSdkConfigureValidationInput { formHubId: string; ruleKey?: string; ruleName?: string; }
export interface DfeSdkConfigureValidationResult { ruleId: string; ruleKey: string; status: string; }
export interface DfeSdkRunFormSubmissionInput { formHubId: string; submissionKey?: string; submissionName?: string; }
export interface DfeSdkRunFormSubmissionResult { submissionId: string; submissionKey: string; status: string; }

export interface FormHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateFormHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface FormDefinitionSummary {
    id: string;
    hubName?: string;
        formKey: string;
    formName: string;
    formType: string;
    status: string;
}

export interface CreateFormDefinitionInput {
        formHubId: string;
        formKey?: string;
    formName?: string;
    formType?: string;
}

export interface FormCategorySummary {
    id: string;
    hubName?: string;
        categoryKey: string;
    categoryName: string;
    categoryType: string;
    status: string;
}

export interface CreateFormCategoryInput {
        formHubId: string;
        categoryKey?: string;
    categoryName?: string;
    categoryType?: string;
}

export interface FormVersionSummary {
    id: string;
    hubName?: string;
        versionKey: string;
    versionNumber: string;
    releaseChannel: string;
    status: string;
}

export interface CreateFormVersionInput {
        formHubId: string;
        versionKey?: string;
    versionNumber?: string;
    releaseChannel?: string;
}

export interface FormDependencySummary {
    id: string;
    hubName?: string;
        dependencyKey: string;
    dependencyType: string;
    dependencyRef: string;
    status: string;
}

export interface CreateFormDependencyInput {
        formHubId: string;
        dependencyKey?: string;
    dependencyType?: string;
    dependencyRef?: string;
}

export interface FormSectionSummary {
    id: string;
    hubName?: string;
        sectionKey: string;
    sectionName: string;
    sectionOrder: number;
    status: string;
}

export interface CreateFormSectionInput {
        formHubId: string;
        sectionKey?: string;
    sectionName?: string;
    sectionOrder?: number;
}

export interface FormTabSummary {
    id: string;
    hubName?: string;
        tabKey: string;
    tabName: string;
    tabOrder: number;
    status: string;
}

export interface CreateFormTabInput {
        formHubId: string;
        tabKey?: string;
    tabName?: string;
    tabOrder?: number;
}

export interface FormGroupSummary {
    id: string;
    hubName?: string;
        groupKey: string;
    groupName: string;
    groupOrder: number;
    status: string;
}

export interface CreateFormGroupInput {
        formHubId: string;
        groupKey?: string;
    groupName?: string;
    groupOrder?: number;
}

export interface RepeatableSectionSummary {
    id: string;
    hubName?: string;
        sectionKey: string;
    sectionName: string;
    minInstances: number;
    status: string;
}

export interface CreateRepeatableSectionInput {
        formHubId: string;
        sectionKey?: string;
    sectionName?: string;
    minInstances?: number;
}

export interface FormFieldSummary {
    id: string;
    hubName?: string;
        fieldKey: string;
    fieldName: string;
    fieldType: string;
    status: string;
}

export interface CreateFormFieldInput {
        formHubId: string;
        fieldKey?: string;
    fieldName?: string;
    fieldType?: string;
}

export interface FieldOptionSummary {
    id: string;
    hubName?: string;
        optionKey: string;
    optionLabel: string;
    optionValue: string;
    status: string;
}

export interface CreateFieldOptionInput {
        formHubId: string;
        optionKey?: string;
    optionLabel?: string;
    optionValue?: string;
}

export interface FormulaFieldSummary {
    id: string;
    hubName?: string;
        formulaKey: string;
    formulaName: string;
    formulaExpression: string;
    status: string;
}

export interface CreateFormulaFieldInput {
        formHubId: string;
        formulaKey?: string;
    formulaName?: string;
    formulaExpression?: string;
}

export interface MediaFieldSummary {
    id: string;
    hubName?: string;
        mediaKey: string;
    mediaName: string;
    mediaType: string;
    status: string;
}

export interface CreateMediaFieldInput {
        formHubId: string;
        mediaKey?: string;
    mediaName?: string;
    mediaType?: string;
}

export interface RequiredRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    fieldRef: string;
    status: string;
}

export interface CreateRequiredRuleInput {
        formHubId: string;
        ruleKey?: string;
    ruleName?: string;
    fieldRef?: string;
}

export interface RegexRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    pattern: string;
    status: string;
}

export interface CreateRegexRuleInput {
        formHubId: string;
        ruleKey?: string;
    ruleName?: string;
    pattern?: string;
}

export interface RangeRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    minValue: number;
    status: string;
}

export interface CreateRangeRuleInput {
        formHubId: string;
        ruleKey?: string;
    ruleName?: string;
    minValue?: number;
}

export interface CrossFieldRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    ruleExpression: string;
    status: string;
}

export interface CreateCrossFieldRuleInput {
        formHubId: string;
        ruleKey?: string;
    ruleName?: string;
    ruleExpression?: string;
}

export interface FormDraftSummary {
    id: string;
    hubName?: string;
        draftKey: string;
    draftName: string;
    draftStatus: string;
    status: string;
}

export interface CreateFormDraftInput {
        formHubId: string;
        draftKey?: string;
    draftName?: string;
    draftStatus?: string;
}

export interface FormSubmissionSummary {
    id: string;
    hubName?: string;
        submissionKey: string;
    submissionName: string;
    submissionStatus: string;
    status: string;
}

export interface CreateFormSubmissionInput {
        formHubId: string;
        submissionKey?: string;
    submissionName?: string;
    submissionStatus?: string;
}

export interface FormReviewSummary {
    id: string;
    hubName?: string;
        reviewKey: string;
    reviewName: string;
    reviewStatus: string;
    status: string;
}

export interface CreateFormReviewInput {
        formHubId: string;
        reviewKey?: string;
    reviewName?: string;
    reviewStatus?: string;
}

export interface ExecutionAuditEntrySummary {
    id: string;
    hubName?: string;
        auditKey: string;
    auditType: string;
    auditSummary: string;
    status: string;
}

export interface CreateExecutionAuditEntryInput {
        formHubId: string;
        auditKey?: string;
    auditType?: string;
    auditSummary?: string;
}

export interface RenderProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    profileType: string;
    status: string;
}

export interface CreateRenderProfileInput {
        formHubId: string;
        profileKey?: string;
    profileName?: string;
    profileType?: string;
}

export interface ThemeConfigSummary {
    id: string;
    hubName?: string;
        themeKey: string;
    themeName: string;
    primaryColor: string;
    status: string;
}

export interface CreateThemeConfigInput {
        formHubId: string;
        themeKey?: string;
    themeName?: string;
    primaryColor?: string;
}

export interface LocalizationPackSummary {
    id: string;
    hubName?: string;
        localeKey: string;
    localeCode: string;
    localeName: string;
    status: string;
}

export interface CreateLocalizationPackInput {
        formHubId: string;
        localeKey?: string;
    localeCode?: string;
    localeName?: string;
}

export interface SubmissionAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateSubmissionAnalyticsInput {
        formHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface CompletionMetricSummary {
    id: string;
    hubName?: string;
        metricKey: string;
    metricName: string;
    completionRate: number;
    status: string;
}

export interface CreateCompletionMetricInput {
        formHubId: string;
        metricKey?: string;
    metricName?: string;
    completionRate?: number;
}

export interface UsageTrendSummary {
    id: string;
    hubName?: string;
        trendKey: string;
    trendName: string;
    trendValue: number;
    status: string;
}

export interface CreateUsageTrendInput {
        formHubId: string;
        trendKey?: string;
    trendName?: string;
    trendValue?: number;
}

export interface FormMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    submissionCount: number;
    overallFormScore: number;
    status: string;
}

export interface CreateFormMetricInput {
        metricsKey?: string;
    submissionCount?: number;
    overallFormScore?: number;
}

export interface FormHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateFormHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface PendingReviewItemSummary {
    id: string;
    hubName?: string;
        itemKey: string;
    itemName: string;
    reviewType: string;
    status: string;
}

export interface CreatePendingReviewItemInput {
        formHubId: string;
        itemKey?: string;
    itemName?: string;
    reviewType?: string;
}

export interface FormFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateFormFailureInput {
        formHubId: string;
        failureKey?: string;
    failureType?: string;
}

