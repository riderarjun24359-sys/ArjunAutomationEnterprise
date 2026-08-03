import type { DbDfeFormHub,
    DbDfeFormDefinition,
    DbDfeFormCategory,
    DbDfeFormVersion,
    DbDfeFormDependency,
    DbDfeFormSection,
    DbDfeFormTab,
    DbDfeFormGroup,
    DbDfeRepeatableSection,
    DbDfeFormField,
    DbDfeFieldOption,
    DbDfeFormulaField,
    DbDfeMediaField,
    DbDfeRequiredRule,
    DbDfeRegexRule,
    DbDfeRangeRule,
    DbDfeCrossFieldRule,
    DbDfeFormDraft,
    DbDfeFormSubmission,
    DbDfeFormReview,
    DbDfeExecutionAuditEntry,
    DbDfeRenderProfile,
    DbDfeThemeConfig,
    DbDfeLocalizationPack,
    DbDfeSubmissionAnalytics,
    DbDfeCompletionMetric,
    DbDfeUsageTrend,
    DbDfeFormMetric,
    DbDfeFormHealth,
    DbDfePendingReviewItem,
    DbDfeFormFailure,
    DbDfeAuditLog } from "@/src/modules/database/types/platform";
import type { CreateFormHubInput,
    FormHubSummary,
    CreateFormDefinitionInput,
    FormDefinitionSummary,
    CreateFormCategoryInput,
    FormCategorySummary,
    CreateFormVersionInput,
    FormVersionSummary,
    CreateFormDependencyInput,
    FormDependencySummary,
    CreateFormSectionInput,
    FormSectionSummary,
    CreateFormTabInput,
    FormTabSummary,
    CreateFormGroupInput,
    FormGroupSummary,
    CreateRepeatableSectionInput,
    RepeatableSectionSummary,
    CreateFormFieldInput,
    FormFieldSummary,
    CreateFieldOptionInput,
    FieldOptionSummary,
    CreateFormulaFieldInput,
    FormulaFieldSummary,
    CreateMediaFieldInput,
    MediaFieldSummary,
    CreateRequiredRuleInput,
    RequiredRuleSummary,
    CreateRegexRuleInput,
    RegexRuleSummary,
    CreateRangeRuleInput,
    RangeRuleSummary,
    CreateCrossFieldRuleInput,
    CrossFieldRuleSummary,
    CreateFormDraftInput,
    FormDraftSummary,
    CreateFormSubmissionInput,
    FormSubmissionSummary,
    CreateFormReviewInput,
    FormReviewSummary,
    CreateExecutionAuditEntryInput,
    ExecutionAuditEntrySummary,
    CreateRenderProfileInput,
    RenderProfileSummary,
    CreateThemeConfigInput,
    ThemeConfigSummary,
    CreateLocalizationPackInput,
    LocalizationPackSummary,
    CreateSubmissionAnalyticsInput,
    SubmissionAnalyticsSummary,
    CreateCompletionMetricInput,
    CompletionMetricSummary,
    CreateUsageTrendInput,
    UsageTrendSummary,
    CreateFormMetricInput,
    FormMetricSummary,
    CreateFormHealthInput,
    FormHealthSummary,
    CreatePendingReviewItemInput,
    PendingReviewItemSummary,
    CreateFormFailureInput,
    FormFailureSummary,
    DfeDashboardStats,
    DfePipelineInfo,
    AuditEntry } from "@/src/modules/form-engine/types";

export function buildFormHubLookupMaps(hubs: DbDfeFormHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildDfePipelineInfo(): DfePipelineInfo {
    const stages = [
        { key: "register", label: "Register" },
        { key: "build", label: "Build" },
        { key: "validate", label: "Validate" },
        { key: "execute", label: "Execute" },
        { key: "render", label: "Render" },
    ];
    return { stages, currentStage: "validate", nextStage: "execute", previousStage: "build" };
}

export function buildDfeAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbDfeAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapFormHubSummary(record: DbDfeFormHub): FormHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildFormHubPayload(organizationId: string, input: CreateFormHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapFormDefinitionSummary(record: DbDfeFormDefinition, maps?: { hubNameById: Map<string, string> }): FormDefinitionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        formKey: record.form_key as string,
        formName: record.form_name as string,
        formType: record.form_type as string,
        status: record.status,
    };
}

export function buildFormDefinitionPayload(organizationId: string, input: CreateFormDefinitionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        form_key: input.formKey ?? '',
        form_name: input.formName ?? '',
        form_type: input.formType ?? '',
        status: "active",
    };
}

export function mapFormCategorySummary(record: DbDfeFormCategory, maps?: { hubNameById: Map<string, string> }): FormCategorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        categoryKey: record.category_key as string,
        categoryName: record.category_name as string,
        categoryType: record.category_type as string,
        status: record.status,
    };
}

export function buildFormCategoryPayload(organizationId: string, input: CreateFormCategoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        category_key: input.categoryKey ?? '',
        category_name: input.categoryName ?? '',
        category_type: input.categoryType ?? '',
        status: "active",
    };
}

export function mapFormVersionSummary(record: DbDfeFormVersion, maps?: { hubNameById: Map<string, string> }): FormVersionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        versionKey: record.version_key as string,
        versionNumber: record.version_number as string,
        releaseChannel: record.release_channel as string,
        status: record.status,
    };
}

export function buildFormVersionPayload(organizationId: string, input: CreateFormVersionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        version_key: input.versionKey ?? '',
        version_number: input.versionNumber ?? '',
        release_channel: input.releaseChannel ?? '',
        status: "active",
    };
}

export function mapFormDependencySummary(record: DbDfeFormDependency, maps?: { hubNameById: Map<string, string> }): FormDependencySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dependencyKey: record.dependency_key as string,
        dependencyType: record.dependency_type as string,
        dependencyRef: record.dependency_ref as string,
        status: record.status,
    };
}

export function buildFormDependencyPayload(organizationId: string, input: CreateFormDependencyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        dependency_key: input.dependencyKey ?? '',
        dependency_type: input.dependencyType ?? '',
        dependency_ref: input.dependencyRef ?? '',
        status: "active",
    };
}

export function mapFormSectionSummary(record: DbDfeFormSection, maps?: { hubNameById: Map<string, string> }): FormSectionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        sectionKey: record.section_key as string,
        sectionName: record.section_name as string,
        sectionOrder: record.section_order as number,
        status: record.status,
    };
}

export function buildFormSectionPayload(organizationId: string, input: CreateFormSectionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        section_key: input.sectionKey ?? '',
        section_name: input.sectionName ?? '',
        section_order: input.sectionOrder ?? 0,
        status: "active",
    };
}

export function mapFormTabSummary(record: DbDfeFormTab, maps?: { hubNameById: Map<string, string> }): FormTabSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        tabKey: record.tab_key as string,
        tabName: record.tab_name as string,
        tabOrder: record.tab_order as number,
        status: record.status,
    };
}

export function buildFormTabPayload(organizationId: string, input: CreateFormTabInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        tab_key: input.tabKey ?? '',
        tab_name: input.tabName ?? '',
        tab_order: input.tabOrder ?? 0,
        status: "active",
    };
}

export function mapFormGroupSummary(record: DbDfeFormGroup, maps?: { hubNameById: Map<string, string> }): FormGroupSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        groupKey: record.group_key as string,
        groupName: record.group_name as string,
        groupOrder: record.group_order as number,
        status: record.status,
    };
}

export function buildFormGroupPayload(organizationId: string, input: CreateFormGroupInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        group_key: input.groupKey ?? '',
        group_name: input.groupName ?? '',
        group_order: input.groupOrder ?? 0,
        status: "active",
    };
}

export function mapRepeatableSectionSummary(record: DbDfeRepeatableSection, maps?: { hubNameById: Map<string, string> }): RepeatableSectionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        sectionKey: record.section_key as string,
        sectionName: record.section_name as string,
        minInstances: record.min_instances as number,
        status: record.status,
    };
}

export function buildRepeatableSectionPayload(organizationId: string, input: CreateRepeatableSectionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        section_key: input.sectionKey ?? '',
        section_name: input.sectionName ?? '',
        min_instances: input.minInstances ?? 0,
        status: "active",
    };
}

export function mapFormFieldSummary(record: DbDfeFormField, maps?: { hubNameById: Map<string, string> }): FormFieldSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        fieldKey: record.field_key as string,
        fieldName: record.field_name as string,
        fieldType: record.field_type as string,
        status: record.status,
    };
}

export function buildFormFieldPayload(organizationId: string, input: CreateFormFieldInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        field_key: input.fieldKey ?? '',
        field_name: input.fieldName ?? '',
        field_type: input.fieldType ?? '',
        status: "active",
    };
}

export function mapFieldOptionSummary(record: DbDfeFieldOption, maps?: { hubNameById: Map<string, string> }): FieldOptionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        optionKey: record.option_key as string,
        optionLabel: record.option_label as string,
        optionValue: record.option_value as string,
        status: record.status,
    };
}

export function buildFieldOptionPayload(organizationId: string, input: CreateFieldOptionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        option_key: input.optionKey ?? '',
        option_label: input.optionLabel ?? '',
        option_value: input.optionValue ?? '',
        status: "active",
    };
}

export function mapFormulaFieldSummary(record: DbDfeFormulaField, maps?: { hubNameById: Map<string, string> }): FormulaFieldSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        formulaKey: record.formula_key as string,
        formulaName: record.formula_name as string,
        formulaExpression: record.formula_expression as string,
        status: record.status,
    };
}

export function buildFormulaFieldPayload(organizationId: string, input: CreateFormulaFieldInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        formula_key: input.formulaKey ?? '',
        formula_name: input.formulaName ?? '',
        formula_expression: input.formulaExpression ?? '',
        status: "active",
    };
}

export function mapMediaFieldSummary(record: DbDfeMediaField, maps?: { hubNameById: Map<string, string> }): MediaFieldSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        mediaKey: record.media_key as string,
        mediaName: record.media_name as string,
        mediaType: record.media_type as string,
        status: record.status,
    };
}

export function buildMediaFieldPayload(organizationId: string, input: CreateMediaFieldInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        media_key: input.mediaKey ?? '',
        media_name: input.mediaName ?? '',
        media_type: input.mediaType ?? '',
        status: "active",
    };
}

export function mapRequiredRuleSummary(record: DbDfeRequiredRule, maps?: { hubNameById: Map<string, string> }): RequiredRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        fieldRef: record.field_ref as string,
        status: record.status,
    };
}

export function buildRequiredRulePayload(organizationId: string, input: CreateRequiredRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        field_ref: input.fieldRef ?? '',
        status: "active",
    };
}

export function mapRegexRuleSummary(record: DbDfeRegexRule, maps?: { hubNameById: Map<string, string> }): RegexRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        pattern: record.pattern as string,
        status: record.status,
    };
}

export function buildRegexRulePayload(organizationId: string, input: CreateRegexRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        pattern: input.pattern ?? '',
        status: "active",
    };
}

export function mapRangeRuleSummary(record: DbDfeRangeRule, maps?: { hubNameById: Map<string, string> }): RangeRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        minValue: record.min_value as number,
        status: record.status,
    };
}

export function buildRangeRulePayload(organizationId: string, input: CreateRangeRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        min_value: input.minValue ?? 0,
        status: "active",
    };
}

export function mapCrossFieldRuleSummary(record: DbDfeCrossFieldRule, maps?: { hubNameById: Map<string, string> }): CrossFieldRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        ruleExpression: record.rule_expression as string,
        status: record.status,
    };
}

export function buildCrossFieldRulePayload(organizationId: string, input: CreateCrossFieldRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        rule_expression: input.ruleExpression ?? '',
        status: "active",
    };
}

export function mapFormDraftSummary(record: DbDfeFormDraft, maps?: { hubNameById: Map<string, string> }): FormDraftSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        draftKey: record.draft_key as string,
        draftName: record.draft_name as string,
        draftStatus: record.draft_status as string,
        status: record.status,
    };
}

export function buildFormDraftPayload(organizationId: string, input: CreateFormDraftInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        draft_key: input.draftKey ?? '',
        draft_name: input.draftName ?? '',
        draft_status: input.draftStatus ?? '',
        status: "active",
    };
}

export function mapFormSubmissionSummary(record: DbDfeFormSubmission, maps?: { hubNameById: Map<string, string> }): FormSubmissionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        submissionKey: record.submission_key as string,
        submissionName: record.submission_name as string,
        submissionStatus: record.submission_status as string,
        status: record.status,
    };
}

export function buildFormSubmissionPayload(organizationId: string, input: CreateFormSubmissionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        submission_key: input.submissionKey ?? '',
        submission_name: input.submissionName ?? '',
        submission_status: input.submissionStatus ?? '',
        status: "active",
    };
}

export function mapFormReviewSummary(record: DbDfeFormReview, maps?: { hubNameById: Map<string, string> }): FormReviewSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reviewKey: record.review_key as string,
        reviewName: record.review_name as string,
        reviewStatus: record.review_status as string,
        status: record.status,
    };
}

export function buildFormReviewPayload(organizationId: string, input: CreateFormReviewInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        review_key: input.reviewKey ?? '',
        review_name: input.reviewName ?? '',
        review_status: input.reviewStatus ?? '',
        status: "active",
    };
}

export function mapExecutionAuditEntrySummary(record: DbDfeExecutionAuditEntry, maps?: { hubNameById: Map<string, string> }): ExecutionAuditEntrySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        auditKey: record.audit_key as string,
        auditType: record.audit_type as string,
        auditSummary: record.audit_summary as string,
        status: record.status,
    };
}

export function buildExecutionAuditEntryPayload(organizationId: string, input: CreateExecutionAuditEntryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        audit_key: input.auditKey ?? '',
        audit_type: input.auditType ?? '',
        audit_summary: input.auditSummary ?? '',
        status: "active",
    };
}

export function mapRenderProfileSummary(record: DbDfeRenderProfile, maps?: { hubNameById: Map<string, string> }): RenderProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        profileType: record.profile_type as string,
        status: record.status,
    };
}

export function buildRenderProfilePayload(organizationId: string, input: CreateRenderProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        profile_type: input.profileType ?? '',
        status: "active",
    };
}

export function mapThemeConfigSummary(record: DbDfeThemeConfig, maps?: { hubNameById: Map<string, string> }): ThemeConfigSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        themeKey: record.theme_key as string,
        themeName: record.theme_name as string,
        primaryColor: record.primary_color as string,
        status: record.status,
    };
}

export function buildThemeConfigPayload(organizationId: string, input: CreateThemeConfigInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        theme_key: input.themeKey ?? '',
        theme_name: input.themeName ?? '',
        primary_color: input.primaryColor ?? '',
        status: "active",
    };
}

export function mapLocalizationPackSummary(record: DbDfeLocalizationPack, maps?: { hubNameById: Map<string, string> }): LocalizationPackSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        localeKey: record.locale_key as string,
        localeCode: record.locale_code as string,
        localeName: record.locale_name as string,
        status: record.status,
    };
}

export function buildLocalizationPackPayload(organizationId: string, input: CreateLocalizationPackInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        locale_key: input.localeKey ?? '',
        locale_code: input.localeCode ?? '',
        locale_name: input.localeName ?? '',
        status: "active",
    };
}

export function mapSubmissionAnalyticsSummary(record: DbDfeSubmissionAnalytics, maps?: { hubNameById: Map<string, string> }): SubmissionAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildSubmissionAnalyticsPayload(organizationId: string, input: CreateSubmissionAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapCompletionMetricSummary(record: DbDfeCompletionMetric, maps?: { hubNameById: Map<string, string> }): CompletionMetricSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        metricKey: record.metric_key as string,
        metricName: record.metric_name as string,
        completionRate: record.completion_rate as number,
        status: record.status,
    };
}

export function buildCompletionMetricPayload(organizationId: string, input: CreateCompletionMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        metric_key: input.metricKey ?? '',
        metric_name: input.metricName ?? '',
        completion_rate: input.completionRate ?? 0,
        status: "active",
    };
}

export function mapUsageTrendSummary(record: DbDfeUsageTrend, maps?: { hubNameById: Map<string, string> }): UsageTrendSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        trendKey: record.trend_key as string,
        trendName: record.trend_name as string,
        trendValue: record.trend_value as number,
        status: record.status,
    };
}

export function buildUsageTrendPayload(organizationId: string, input: CreateUsageTrendInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        trend_key: input.trendKey ?? '',
        trend_name: input.trendName ?? '',
        trend_value: input.trendValue ?? 0,
        status: "active",
    };
}

export function mapFormMetricSummary(record: DbDfeFormMetric): FormMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        submissionCount: record.submission_count as number,
        overallFormScore: record.overall_form_score as number,
        status: record.status,
    };
}

export function buildFormMetricPayload(organizationId: string, input: CreateFormMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        submission_count: input.submissionCount ?? 0,
        overall_form_score: input.overallFormScore ?? 0,
        status: "active",
    };
}

export function mapFormHealthSummary(record: DbDfeFormHealth): FormHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildFormHealthPayload(organizationId: string, input: CreateFormHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapPendingReviewItemSummary(record: DbDfePendingReviewItem, maps?: { hubNameById: Map<string, string> }): PendingReviewItemSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        itemKey: record.item_key as string,
        itemName: record.item_name as string,
        reviewType: record.review_type as string,
        status: record.status,
    };
}

export function buildPendingReviewItemPayload(organizationId: string, input: CreatePendingReviewItemInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        item_key: input.itemKey ?? '',
        item_name: input.itemName ?? '',
        review_type: input.reviewType ?? '',
        status: "active",
    };
}

export function mapFormFailureSummary(record: DbDfeFormFailure, maps?: { hubNameById: Map<string, string> }): FormFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildFormFailurePayload(organizationId: string, input: CreateFormFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.formHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapFormSectionForStats(r: DbDfeFormSection) { return { status: r.status }; }
export function mapRequiredRuleForStats(r: DbDfeRequiredRule) { return { status: r.status }; }
export function mapFormMetricForStats(r: DbDfeFormMetric) {
    return {
        submission_count: r.submission_count,
        completion_rate: r.completion_rate,
        average_completion_time_ms: r.average_completion_time_ms,
        validation_error_count: r.validation_error_count,
        abandonment_rate: r.abandonment_rate,
        overall_form_score: r.overall_form_score,
        status: r.status,
    };
}
export function mapFormSubmissionForStats(r: DbDfeFormSubmission) { return { submission_status: r.submission_status, status: r.status }; }
export function mapPendingReviewItemForStats(r: DbDfePendingReviewItem) { return { status: r.status }; }
export function mapRegexRuleForStats(r: DbDfeRegexRule) { return { status: r.status }; }
export function mapFormHealthForStats(r: DbDfeFormHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapFormFailureForStats(r: DbDfeFormFailure) { return { status: r.status }; }

export function buildDfeDashboardStats(input: {
    formHubs: FormHubSummary[];
    formSections: ReturnType<typeof mapFormSectionForStats>[];
    requiredRules: ReturnType<typeof mapRequiredRuleForStats>[];
    formMetrics: ReturnType<typeof mapFormMetricForStats>[];
    formSubmissions: ReturnType<typeof mapFormSubmissionForStats>[];
    pendingReviewItems: ReturnType<typeof mapPendingReviewItemForStats>[];
    regexRules: ReturnType<typeof mapRegexRuleForStats>[];
    formHealth: ReturnType<typeof mapFormHealthForStats>[];
    formFailures: FormFailureSummary[];
    auditLogs: AuditEntry[];
}): DfeDashboardStats {
    const activeHubs = input.formHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.formMetrics[0];
    const latestHealth = input.formHealth[0];
    return {
        totalFormHubs: input.formHubs.length,
        activeFormHubs: activeHubs,
        formSectionCount: input.formSections.length,
        requiredRuleCount: input.requiredRules.length,
        formSubmissionCount: input.formSubmissions.length,
        openPendingReviewCount: input.pendingReviewItems.filter((r) => r.status === "open").length,
        openFailureCount: input.formFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallFormScore: latestMetrics?.overall_form_score ?? latestHealth?.overall_score ?? 0,
        submissionCountScore: latestMetrics?.submission_count ?? 0,
        completionRateScore: latestMetrics?.completion_rate ?? 0,
        validationErrorScore: latestMetrics?.validation_error_count ?? 0,
        abandonmentRateScore: latestMetrics?.abandonment_rate ?? 0,
        averageCompletionTimeScore: latestMetrics?.average_completion_time_ms ?? 0,
        auditCount: input.auditLogs.length,
    };
}
