"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { formEngineService } from "@/src/modules/form-engine/services/form-engine.service";
import type {
    FormHubSummary,
    CreateFormHubInput,
    FormDefinitionSummary,
    CreateFormDefinitionInput,
    FormCategorySummary,
    CreateFormCategoryInput,
    FormVersionSummary,
    CreateFormVersionInput,
    FormDependencySummary,
    CreateFormDependencyInput,
    FormSectionSummary,
    CreateFormSectionInput,
    FormTabSummary,
    CreateFormTabInput,
    FormGroupSummary,
    CreateFormGroupInput,
    RepeatableSectionSummary,
    CreateRepeatableSectionInput,
    FormFieldSummary,
    CreateFormFieldInput,
    FieldOptionSummary,
    CreateFieldOptionInput,
    FormulaFieldSummary,
    CreateFormulaFieldInput,
    MediaFieldSummary,
    CreateMediaFieldInput,
    RequiredRuleSummary,
    CreateRequiredRuleInput,
    RegexRuleSummary,
    CreateRegexRuleInput,
    RangeRuleSummary,
    CreateRangeRuleInput,
    CrossFieldRuleSummary,
    CreateCrossFieldRuleInput,
    FormDraftSummary,
    CreateFormDraftInput,
    FormSubmissionSummary,
    CreateFormSubmissionInput,
    FormReviewSummary,
    CreateFormReviewInput,
    ExecutionAuditEntrySummary,
    CreateExecutionAuditEntryInput,
    RenderProfileSummary,
    CreateRenderProfileInput,
    ThemeConfigSummary,
    CreateThemeConfigInput,
    LocalizationPackSummary,
    CreateLocalizationPackInput,
    SubmissionAnalyticsSummary,
    CreateSubmissionAnalyticsInput,
    CompletionMetricSummary,
    CreateCompletionMetricInput,
    UsageTrendSummary,
    CreateUsageTrendInput,
    FormMetricSummary,
    CreateFormMetricInput,
    FormHealthSummary,
    CreateFormHealthInput,
    PendingReviewItemSummary,
    CreatePendingReviewItemInput,
    FormFailureSummary,
    CreateFormFailureInput,
    AuditEntry,
    DfeDashboardStats,
    DfePipelineInfo,
} from "@/src/modules/form-engine/types";

export function useFormEngine() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DfeDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<DfePipelineInfo | null>(null);
    const [formHubs, setFormHubs] = useState<FormHubSummary[]>([]);
    const [formDefinitions, setFormDefinitions] = useState<FormDefinitionSummary[]>([]);
    const [formCategories, setFormCategorys] = useState<FormCategorySummary[]>([]);
    const [formVersions, setFormVersions] = useState<FormVersionSummary[]>([]);
    const [formDependencies, setFormDependencys] = useState<FormDependencySummary[]>([]);
    const [formSections, setFormSections] = useState<FormSectionSummary[]>([]);
    const [formTabs, setFormTabs] = useState<FormTabSummary[]>([]);
    const [formGroups, setFormGroups] = useState<FormGroupSummary[]>([]);
    const [repeatableSections, setRepeatableSections] = useState<RepeatableSectionSummary[]>([]);
    const [formFields, setFormFields] = useState<FormFieldSummary[]>([]);
    const [fieldOptions, setFieldOptions] = useState<FieldOptionSummary[]>([]);
    const [formulaFields, setFormulaFields] = useState<FormulaFieldSummary[]>([]);
    const [mediaFields, setMediaFields] = useState<MediaFieldSummary[]>([]);
    const [requiredRules, setRequiredRules] = useState<RequiredRuleSummary[]>([]);
    const [regexRules, setRegexRules] = useState<RegexRuleSummary[]>([]);
    const [rangeRules, setRangeRules] = useState<RangeRuleSummary[]>([]);
    const [crossFieldRules, setCrossFieldRules] = useState<CrossFieldRuleSummary[]>([]);
    const [formDrafts, setFormDrafts] = useState<FormDraftSummary[]>([]);
    const [formSubmissions, setFormSubmissions] = useState<FormSubmissionSummary[]>([]);
    const [formReviews, setFormReviews] = useState<FormReviewSummary[]>([]);
    const [executionAuditEntries, setExecutionAuditEntrys] = useState<ExecutionAuditEntrySummary[]>([]);
    const [renderProfiles, setRenderProfiles] = useState<RenderProfileSummary[]>([]);
    const [themeConfigs, setThemeConfigs] = useState<ThemeConfigSummary[]>([]);
    const [localizationPacks, setLocalizationPacks] = useState<LocalizationPackSummary[]>([]);
    const [submissionAnalytics, setSubmissionAnalyticss] = useState<SubmissionAnalyticsSummary[]>([]);
    const [completionMetrics, setCompletionMetrics] = useState<CompletionMetricSummary[]>([]);
    const [usageTrends, setUsageTrends] = useState<UsageTrendSummary[]>([]);
    const [formMetrics, setFormMetrics] = useState<FormMetricSummary[]>([]);
    const [formHealth, setFormHealths] = useState<FormHealthSummary[]>([]);
    const [pendingReviewItems, setPendingReviewItems] = useState<PendingReviewItemSummary[]>([]);
    const [formFailures, setFormFailures] = useState<FormFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [formHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
formHubsList,
            formDefinitionsList,
            formCategoriesList,
            formVersionsList,
            formDependenciesList,
            formSectionsList,
            formTabsList,
            formGroupsList,
            repeatableSectionsList,
            formFieldsList,
            fieldOptionsList,
            formulaFieldsList,
            mediaFieldsList,
            requiredRulesList,
            regexRulesList,
            rangeRulesList,
            crossFieldRulesList,
            formDraftsList,
            formSubmissionsList,
            formReviewsList,
            executionAuditEntriesList,
            renderProfilesList,
            themeConfigsList,
            localizationPacksList,
            submissionAnalyticsList,
            completionMetricsList,
            usageTrendsList,
            formMetricsList,
            formHealthList,
            pendingReviewItemsList,
            formFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            formEngineService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(formEngineService.getPipelineInfo()),
            formEngineService.getFormHubs(authUserId, email, fullName),
            formEngineService.getFormDefinitions(authUserId, email, fullName),
            formEngineService.getFormCategorys(authUserId, email, fullName),
            formEngineService.getFormVersions(authUserId, email, fullName),
            formEngineService.getFormDependencys(authUserId, email, fullName),
            formEngineService.getFormSections(authUserId, email, fullName),
            formEngineService.getFormTabs(authUserId, email, fullName),
            formEngineService.getFormGroups(authUserId, email, fullName),
            formEngineService.getRepeatableSections(authUserId, email, fullName),
            formEngineService.getFormFields(authUserId, email, fullName),
            formEngineService.getFieldOptions(authUserId, email, fullName),
            formEngineService.getFormulaFields(authUserId, email, fullName),
            formEngineService.getMediaFields(authUserId, email, fullName),
            formEngineService.getRequiredRules(authUserId, email, fullName),
            formEngineService.getRegexRules(authUserId, email, fullName),
            formEngineService.getRangeRules(authUserId, email, fullName),
            formEngineService.getCrossFieldRules(authUserId, email, fullName),
            formEngineService.getFormDrafts(authUserId, email, fullName),
            formEngineService.getFormSubmissions(authUserId, email, fullName),
            formEngineService.getFormReviews(authUserId, email, fullName),
            formEngineService.getExecutionAuditEntrys(authUserId, email, fullName),
            formEngineService.getRenderProfiles(authUserId, email, fullName),
            formEngineService.getThemeConfigs(authUserId, email, fullName),
            formEngineService.getLocalizationPacks(authUserId, email, fullName),
            formEngineService.getSubmissionAnalyticss(authUserId, email, fullName),
            formEngineService.getCompletionMetrics(authUserId, email, fullName),
            formEngineService.getUsageTrends(authUserId, email, fullName),
            formEngineService.getFormMetrics(authUserId, email, fullName),
            formEngineService.getFormHealths(authUserId, email, fullName),
            formEngineService.getPendingReviewItems(authUserId, email, fullName),
            formEngineService.getFormFailures(authUserId, email, fullName),
            formEngineService.getAuditLogs(authUserId, email, fullName),
            formEngineService.getFormHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
formHubsList,
            formDefinitionsList,
            formCategoriesList,
            formVersionsList,
            formDependenciesList,
            formSectionsList,
            formTabsList,
            formGroupsList,
            repeatableSectionsList,
            formFieldsList,
            fieldOptionsList,
            formulaFieldsList,
            mediaFieldsList,
            requiredRulesList,
            regexRulesList,
            rangeRulesList,
            crossFieldRulesList,
            formDraftsList,
            formSubmissionsList,
            formReviewsList,
            executionAuditEntriesList,
            renderProfilesList,
            themeConfigsList,
            localizationPacksList,
            submissionAnalyticsList,
            completionMetricsList,
            usageTrendsList,
            formMetricsList,
            formHealthList,
            pendingReviewItemsList,
            formFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setFormHubs(result.formHubsList);
        setFormDefinitions(result.formDefinitionsList);
        setFormCategorys(result.formCategoriesList);
        setFormVersions(result.formVersionsList);
        setFormDependencys(result.formDependenciesList);
        setFormSections(result.formSectionsList);
        setFormTabs(result.formTabsList);
        setFormGroups(result.formGroupsList);
        setRepeatableSections(result.repeatableSectionsList);
        setFormFields(result.formFieldsList);
        setFieldOptions(result.fieldOptionsList);
        setFormulaFields(result.formulaFieldsList);
        setMediaFields(result.mediaFieldsList);
        setRequiredRules(result.requiredRulesList);
        setRegexRules(result.regexRulesList);
        setRangeRules(result.rangeRulesList);
        setCrossFieldRules(result.crossFieldRulesList);
        setFormDrafts(result.formDraftsList);
        setFormSubmissions(result.formSubmissionsList);
        setFormReviews(result.formReviewsList);
        setExecutionAuditEntrys(result.executionAuditEntriesList);
        setRenderProfiles(result.renderProfilesList);
        setThemeConfigs(result.themeConfigsList);
        setLocalizationPacks(result.localizationPacksList);
        setSubmissionAnalyticss(result.submissionAnalyticsList);
        setCompletionMetrics(result.completionMetricsList);
        setUsageTrends(result.usageTrendsList);
        setFormMetrics(result.formMetricsList);
        setFormHealths(result.formHealthList);
        setPendingReviewItems(result.pendingReviewItemsList);
        setFormFailures(result.formFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createFormHub = useCallback(async (input: CreateFormHubInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormDefinition = useCallback(async (input: CreateFormDefinitionInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormDefinition(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormCategory = useCallback(async (input: CreateFormCategoryInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormCategory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormVersion = useCallback(async (input: CreateFormVersionInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormDependency = useCallback(async (input: CreateFormDependencyInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormDependency(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormSection = useCallback(async (input: CreateFormSectionInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormSection(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormTab = useCallback(async (input: CreateFormTabInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormTab(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormGroup = useCallback(async (input: CreateFormGroupInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormGroup(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRepeatableSection = useCallback(async (input: CreateRepeatableSectionInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createRepeatableSection(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormField = useCallback(async (input: CreateFormFieldInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormField(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFieldOption = useCallback(async (input: CreateFieldOptionInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFieldOption(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormulaField = useCallback(async (input: CreateFormulaFieldInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormulaField(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMediaField = useCallback(async (input: CreateMediaFieldInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createMediaField(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRequiredRule = useCallback(async (input: CreateRequiredRuleInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createRequiredRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRegexRule = useCallback(async (input: CreateRegexRuleInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createRegexRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRangeRule = useCallback(async (input: CreateRangeRuleInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createRangeRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCrossFieldRule = useCallback(async (input: CreateCrossFieldRuleInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createCrossFieldRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormDraft = useCallback(async (input: CreateFormDraftInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormDraft(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormSubmission = useCallback(async (input: CreateFormSubmissionInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormSubmission(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormReview = useCallback(async (input: CreateFormReviewInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormReview(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutionAuditEntry = useCallback(async (input: CreateExecutionAuditEntryInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createExecutionAuditEntry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRenderProfile = useCallback(async (input: CreateRenderProfileInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createRenderProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createThemeConfig = useCallback(async (input: CreateThemeConfigInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createThemeConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLocalizationPack = useCallback(async (input: CreateLocalizationPackInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createLocalizationPack(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSubmissionAnalytics = useCallback(async (input: CreateSubmissionAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createSubmissionAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCompletionMetric = useCallback(async (input: CreateCompletionMetricInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createCompletionMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUsageTrend = useCallback(async (input: CreateUsageTrendInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createUsageTrend(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormMetric = useCallback(async (input: CreateFormMetricInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormHealth = useCallback(async (input: CreateFormHealthInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPendingReviewItem = useCallback(async (input: CreatePendingReviewItemInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createPendingReviewItem(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createFormFailure = useCallback(async (input: CreateFormFailureInput) => { if (!user) throw new Error("Authentication required"); await formEngineService.createFormFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        formHubs,
        createFormHub,
        formDefinitions,
        createFormDefinition,
        formCategories,
        createFormCategory,
        formVersions,
        createFormVersion,
        formDependencies,
        createFormDependency,
        formSections,
        createFormSection,
        formTabs,
        createFormTab,
        formGroups,
        createFormGroup,
        repeatableSections,
        createRepeatableSection,
        formFields,
        createFormField,
        fieldOptions,
        createFieldOption,
        formulaFields,
        createFormulaField,
        mediaFields,
        createMediaField,
        requiredRules,
        createRequiredRule,
        regexRules,
        createRegexRule,
        rangeRules,
        createRangeRule,
        crossFieldRules,
        createCrossFieldRule,
        formDrafts,
        createFormDraft,
        formSubmissions,
        createFormSubmission,
        formReviews,
        createFormReview,
        executionAuditEntries,
        createExecutionAuditEntry,
        renderProfiles,
        createRenderProfile,
        themeConfigs,
        createThemeConfig,
        localizationPacks,
        createLocalizationPack,
        submissionAnalytics,
        createSubmissionAnalytics,
        completionMetrics,
        createCompletionMetric,
        usageTrends,
        createUsageTrend,
        formMetrics,
        createFormMetric,
        formHealth,
        createFormHealth,
        pendingReviewItems,
        createPendingReviewItem,
        formFailures,
        createFormFailure,
        auditLogs,
        formHubOptions,
        refresh,
    };
}
