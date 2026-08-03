import {
    buildFormHubLookupMaps,
    buildDfeAuditPayload,
    buildDfeDashboardStats,
    buildDfePipelineInfo,
    mapAuditEntry,
    buildFormHubPayload,
    mapFormHubSummary,
    buildFormDefinitionPayload,
    mapFormDefinitionSummary,
    buildFormCategoryPayload,
    mapFormCategorySummary,
    buildFormVersionPayload,
    mapFormVersionSummary,
    buildFormDependencyPayload,
    mapFormDependencySummary,
    buildFormSectionPayload,
    mapFormSectionSummary,
    buildFormTabPayload,
    mapFormTabSummary,
    buildFormGroupPayload,
    mapFormGroupSummary,
    buildRepeatableSectionPayload,
    mapRepeatableSectionSummary,
    buildFormFieldPayload,
    mapFormFieldSummary,
    buildFieldOptionPayload,
    mapFieldOptionSummary,
    buildFormulaFieldPayload,
    mapFormulaFieldSummary,
    buildMediaFieldPayload,
    mapMediaFieldSummary,
    buildRequiredRulePayload,
    mapRequiredRuleSummary,
    buildRegexRulePayload,
    mapRegexRuleSummary,
    buildRangeRulePayload,
    mapRangeRuleSummary,
    buildCrossFieldRulePayload,
    mapCrossFieldRuleSummary,
    buildFormDraftPayload,
    mapFormDraftSummary,
    buildFormSubmissionPayload,
    mapFormSubmissionSummary,
    buildFormReviewPayload,
    mapFormReviewSummary,
    buildExecutionAuditEntryPayload,
    mapExecutionAuditEntrySummary,
    buildRenderProfilePayload,
    mapRenderProfileSummary,
    buildThemeConfigPayload,
    mapThemeConfigSummary,
    buildLocalizationPackPayload,
    mapLocalizationPackSummary,
    buildSubmissionAnalyticsPayload,
    mapSubmissionAnalyticsSummary,
    buildCompletionMetricPayload,
    mapCompletionMetricSummary,
    buildUsageTrendPayload,
    mapUsageTrendSummary,
    buildFormMetricPayload,
    mapFormMetricSummary,
    buildFormHealthPayload,
    mapFormHealthSummary,
    buildPendingReviewItemPayload,
    mapPendingReviewItemSummary,
    buildFormFailurePayload,
    mapFormFailureSummary,
    mapFormSectionForStats,
    mapRequiredRuleForStats,
    mapFormMetricForStats,
    mapFormSubmissionForStats,
    mapPendingReviewItemForStats,
    mapRegexRuleForStats,
    mapFormHealthForStats,
    mapFormFailureForStats,
} from "@/src/modules/database/lib/form-engine-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
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
    DfeSdkRegisterFormInput,
    DfeSdkRegisterFormResult,
    DfeSdkConfigureValidationInput,
    DfeSdkConfigureValidationResult,
    DfeSdkRunFormSubmissionInput,
    DfeSdkRunFormSubmissionResult,
} from "@/src/modules/form-engine/types";

export class FormEngineService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const formHubs = await databaseService.dfeFormHubs.listByOrganization(organizationId);
        return buildFormHubLookupMaps(formHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<DfeDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildDfeDashboardStats({ formHubs: [], formSections: [], requiredRules: [], formMetrics: [], formSubmissions: [], pendingReviewItems: [], regexRules: [], formHealth: [], formFailures: [], auditLogs: [] });
        const [formHubs, formSectionsRaw, requiredRulesRaw, formMetricsRaw, formSubmissionsRaw, pendingReviewItemsRaw, regexRulesRaw, formHealthRaw, formFailures, auditLogs] = await Promise.all([
            this.getFormHubs(authUserId, email, fullName),
            databaseService.dfeFormSections.listByOrganization(context.organizationId),
            databaseService.dfeRequiredRules.listByOrganization(context.organizationId),
            databaseService.dfeFormMetrics.listByOrganization(context.organizationId),
            databaseService.dfeFormSubmissions.listByOrganization(context.organizationId),
            databaseService.dfePendingReviewItems.listByOrganization(context.organizationId),
            databaseService.dfeRegexRules.listByOrganization(context.organizationId),
            databaseService.dfeFormHealth.listByOrganization(context.organizationId),
            this.getFormFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildDfeDashboardStats({
            formHubs,
            formSections: formSectionsRaw.map(mapFormSectionForStats),
            requiredRules: requiredRulesRaw.map(mapRequiredRuleForStats),
            formMetrics: formMetricsRaw.map(mapFormMetricForStats),
            formSubmissions: formSubmissionsRaw.map(mapFormSubmissionForStats),
            pendingReviewItems: pendingReviewItemsRaw.map(mapPendingReviewItemForStats),
            regexRules: regexRulesRaw.map(mapRegexRuleForStats),
            formHealth: formHealthRaw.map(mapFormHealthForStats),
            formFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): DfePipelineInfo {
        return buildDfePipelineInfo();
    }

    async getFormHubs(authUserId: string, email: string, fullName?: string | null): Promise<FormHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfeFormHubs.listByOrganization(context.organizationId)).map((r) => mapFormHubSummary(r));
    }

    async createFormHub(authUserId: string, email: string, input: CreateFormHubInput, fullName?: string | null): Promise<FormHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormHubs.create(buildFormHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formHubs");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_hubs", "create", `FormHub created`, created.id));
        return mapFormHubSummary(created);
    }

    async getFormDefinitions(authUserId: string, email: string, fullName?: string | null): Promise<FormDefinitionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormDefinitions.listByOrganization(context.organizationId)).map((r) => mapFormDefinitionSummary(r, maps));
    }

    async createFormDefinition(authUserId: string, email: string, input: CreateFormDefinitionInput, fullName?: string | null): Promise<FormDefinitionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormDefinitions.create(buildFormDefinitionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formDefinitions");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_definitions", "create", `FormDefinition created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormDefinitionSummary(created, maps);
    }

    async getFormCategorys(authUserId: string, email: string, fullName?: string | null): Promise<FormCategorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormCategories.listByOrganization(context.organizationId)).map((r) => mapFormCategorySummary(r, maps));
    }

    async createFormCategory(authUserId: string, email: string, input: CreateFormCategoryInput, fullName?: string | null): Promise<FormCategorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormCategories.create(buildFormCategoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formCategories");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_categories", "create", `FormCategory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormCategorySummary(created, maps);
    }

    async getFormVersions(authUserId: string, email: string, fullName?: string | null): Promise<FormVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormVersions.listByOrganization(context.organizationId)).map((r) => mapFormVersionSummary(r, maps));
    }

    async createFormVersion(authUserId: string, email: string, input: CreateFormVersionInput, fullName?: string | null): Promise<FormVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormVersions.create(buildFormVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formVersions");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_versions", "create", `FormVersion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormVersionSummary(created, maps);
    }

    async getFormDependencys(authUserId: string, email: string, fullName?: string | null): Promise<FormDependencySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormDependencies.listByOrganization(context.organizationId)).map((r) => mapFormDependencySummary(r, maps));
    }

    async createFormDependency(authUserId: string, email: string, input: CreateFormDependencyInput, fullName?: string | null): Promise<FormDependencySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormDependencies.create(buildFormDependencyPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formDependencies");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_dependencies", "create", `FormDependency created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormDependencySummary(created, maps);
    }

    async getFormSections(authUserId: string, email: string, fullName?: string | null): Promise<FormSectionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormSections.listByOrganization(context.organizationId)).map((r) => mapFormSectionSummary(r, maps));
    }

    async createFormSection(authUserId: string, email: string, input: CreateFormSectionInput, fullName?: string | null): Promise<FormSectionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormSections.create(buildFormSectionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formSections");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_sections", "create", `FormSection created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormSectionSummary(created, maps);
    }

    async getFormTabs(authUserId: string, email: string, fullName?: string | null): Promise<FormTabSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormTabs.listByOrganization(context.organizationId)).map((r) => mapFormTabSummary(r, maps));
    }

    async createFormTab(authUserId: string, email: string, input: CreateFormTabInput, fullName?: string | null): Promise<FormTabSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormTabs.create(buildFormTabPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formTabs");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_tabs", "create", `FormTab created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormTabSummary(created, maps);
    }

    async getFormGroups(authUserId: string, email: string, fullName?: string | null): Promise<FormGroupSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormGroups.listByOrganization(context.organizationId)).map((r) => mapFormGroupSummary(r, maps));
    }

    async createFormGroup(authUserId: string, email: string, input: CreateFormGroupInput, fullName?: string | null): Promise<FormGroupSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormGroups.create(buildFormGroupPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formGroups");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_groups", "create", `FormGroup created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormGroupSummary(created, maps);
    }

    async getRepeatableSections(authUserId: string, email: string, fullName?: string | null): Promise<RepeatableSectionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeRepeatableSections.listByOrganization(context.organizationId)).map((r) => mapRepeatableSectionSummary(r, maps));
    }

    async createRepeatableSection(authUserId: string, email: string, input: CreateRepeatableSectionInput, fullName?: string | null): Promise<RepeatableSectionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeRepeatableSections.create(buildRepeatableSectionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create repeatableSections");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "repeatable_sections", "create", `RepeatableSection created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRepeatableSectionSummary(created, maps);
    }

    async getFormFields(authUserId: string, email: string, fullName?: string | null): Promise<FormFieldSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormFields.listByOrganization(context.organizationId)).map((r) => mapFormFieldSummary(r, maps));
    }

    async createFormField(authUserId: string, email: string, input: CreateFormFieldInput, fullName?: string | null): Promise<FormFieldSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormFields.create(buildFormFieldPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formFields");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_fields", "create", `FormField created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormFieldSummary(created, maps);
    }

    async getFieldOptions(authUserId: string, email: string, fullName?: string | null): Promise<FieldOptionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFieldOptions.listByOrganization(context.organizationId)).map((r) => mapFieldOptionSummary(r, maps));
    }

    async createFieldOption(authUserId: string, email: string, input: CreateFieldOptionInput, fullName?: string | null): Promise<FieldOptionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFieldOptions.create(buildFieldOptionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create fieldOptions");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "field_options", "create", `FieldOption created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFieldOptionSummary(created, maps);
    }

    async getFormulaFields(authUserId: string, email: string, fullName?: string | null): Promise<FormulaFieldSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormulaFields.listByOrganization(context.organizationId)).map((r) => mapFormulaFieldSummary(r, maps));
    }

    async createFormulaField(authUserId: string, email: string, input: CreateFormulaFieldInput, fullName?: string | null): Promise<FormulaFieldSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormulaFields.create(buildFormulaFieldPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formulaFields");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "formula_fields", "create", `FormulaField created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormulaFieldSummary(created, maps);
    }

    async getMediaFields(authUserId: string, email: string, fullName?: string | null): Promise<MediaFieldSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeMediaFields.listByOrganization(context.organizationId)).map((r) => mapMediaFieldSummary(r, maps));
    }

    async createMediaField(authUserId: string, email: string, input: CreateMediaFieldInput, fullName?: string | null): Promise<MediaFieldSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeMediaFields.create(buildMediaFieldPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create mediaFields");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "media_fields", "create", `MediaField created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapMediaFieldSummary(created, maps);
    }

    async getRequiredRules(authUserId: string, email: string, fullName?: string | null): Promise<RequiredRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeRequiredRules.listByOrganization(context.organizationId)).map((r) => mapRequiredRuleSummary(r, maps));
    }

    async createRequiredRule(authUserId: string, email: string, input: CreateRequiredRuleInput, fullName?: string | null): Promise<RequiredRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeRequiredRules.create(buildRequiredRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create requiredRules");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "required_rules", "create", `RequiredRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRequiredRuleSummary(created, maps);
    }

    async getRegexRules(authUserId: string, email: string, fullName?: string | null): Promise<RegexRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeRegexRules.listByOrganization(context.organizationId)).map((r) => mapRegexRuleSummary(r, maps));
    }

    async createRegexRule(authUserId: string, email: string, input: CreateRegexRuleInput, fullName?: string | null): Promise<RegexRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeRegexRules.create(buildRegexRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create regexRules");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "regex_rules", "create", `RegexRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRegexRuleSummary(created, maps);
    }

    async getRangeRules(authUserId: string, email: string, fullName?: string | null): Promise<RangeRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeRangeRules.listByOrganization(context.organizationId)).map((r) => mapRangeRuleSummary(r, maps));
    }

    async createRangeRule(authUserId: string, email: string, input: CreateRangeRuleInput, fullName?: string | null): Promise<RangeRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeRangeRules.create(buildRangeRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create rangeRules");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "range_rules", "create", `RangeRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRangeRuleSummary(created, maps);
    }

    async getCrossFieldRules(authUserId: string, email: string, fullName?: string | null): Promise<CrossFieldRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeCrossFieldRules.listByOrganization(context.organizationId)).map((r) => mapCrossFieldRuleSummary(r, maps));
    }

    async createCrossFieldRule(authUserId: string, email: string, input: CreateCrossFieldRuleInput, fullName?: string | null): Promise<CrossFieldRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeCrossFieldRules.create(buildCrossFieldRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create crossFieldRules");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "cross_field_rules", "create", `CrossFieldRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCrossFieldRuleSummary(created, maps);
    }

    async getFormDrafts(authUserId: string, email: string, fullName?: string | null): Promise<FormDraftSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormDrafts.listByOrganization(context.organizationId)).map((r) => mapFormDraftSummary(r, maps));
    }

    async createFormDraft(authUserId: string, email: string, input: CreateFormDraftInput, fullName?: string | null): Promise<FormDraftSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormDrafts.create(buildFormDraftPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formDrafts");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_drafts", "create", `FormDraft created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormDraftSummary(created, maps);
    }

    async getFormSubmissions(authUserId: string, email: string, fullName?: string | null): Promise<FormSubmissionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormSubmissions.listByOrganization(context.organizationId)).map((r) => mapFormSubmissionSummary(r, maps));
    }

    async createFormSubmission(authUserId: string, email: string, input: CreateFormSubmissionInput, fullName?: string | null): Promise<FormSubmissionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormSubmissions.create(buildFormSubmissionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formSubmissions");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_submissions", "create", `FormSubmission created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormSubmissionSummary(created, maps);
    }

    async getFormReviews(authUserId: string, email: string, fullName?: string | null): Promise<FormReviewSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormReviews.listByOrganization(context.organizationId)).map((r) => mapFormReviewSummary(r, maps));
    }

    async createFormReview(authUserId: string, email: string, input: CreateFormReviewInput, fullName?: string | null): Promise<FormReviewSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormReviews.create(buildFormReviewPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formReviews");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_reviews", "create", `FormReview created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormReviewSummary(created, maps);
    }

    async getExecutionAuditEntrys(authUserId: string, email: string, fullName?: string | null): Promise<ExecutionAuditEntrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeExecutionAuditEntries.listByOrganization(context.organizationId)).map((r) => mapExecutionAuditEntrySummary(r, maps));
    }

    async createExecutionAuditEntry(authUserId: string, email: string, input: CreateExecutionAuditEntryInput, fullName?: string | null): Promise<ExecutionAuditEntrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeExecutionAuditEntries.create(buildExecutionAuditEntryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executionAuditEntries");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "execution_audit_entries", "create", `ExecutionAuditEntry created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutionAuditEntrySummary(created, maps);
    }

    async getRenderProfiles(authUserId: string, email: string, fullName?: string | null): Promise<RenderProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeRenderProfiles.listByOrganization(context.organizationId)).map((r) => mapRenderProfileSummary(r, maps));
    }

    async createRenderProfile(authUserId: string, email: string, input: CreateRenderProfileInput, fullName?: string | null): Promise<RenderProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeRenderProfiles.create(buildRenderProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create renderProfiles");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "render_profiles", "create", `RenderProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapRenderProfileSummary(created, maps);
    }

    async getThemeConfigs(authUserId: string, email: string, fullName?: string | null): Promise<ThemeConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeThemeConfigs.listByOrganization(context.organizationId)).map((r) => mapThemeConfigSummary(r, maps));
    }

    async createThemeConfig(authUserId: string, email: string, input: CreateThemeConfigInput, fullName?: string | null): Promise<ThemeConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeThemeConfigs.create(buildThemeConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create themeConfigs");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "theme_configs", "create", `ThemeConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapThemeConfigSummary(created, maps);
    }

    async getLocalizationPacks(authUserId: string, email: string, fullName?: string | null): Promise<LocalizationPackSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeLocalizationPacks.listByOrganization(context.organizationId)).map((r) => mapLocalizationPackSummary(r, maps));
    }

    async createLocalizationPack(authUserId: string, email: string, input: CreateLocalizationPackInput, fullName?: string | null): Promise<LocalizationPackSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeLocalizationPacks.create(buildLocalizationPackPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create localizationPacks");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "localization_packs", "create", `LocalizationPack created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLocalizationPackSummary(created, maps);
    }

    async getSubmissionAnalyticss(authUserId: string, email: string, fullName?: string | null): Promise<SubmissionAnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeSubmissionAnalytics.listByOrganization(context.organizationId)).map((r) => mapSubmissionAnalyticsSummary(r, maps));
    }

    async createSubmissionAnalytics(authUserId: string, email: string, input: CreateSubmissionAnalyticsInput, fullName?: string | null): Promise<SubmissionAnalyticsSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeSubmissionAnalytics.create(buildSubmissionAnalyticsPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create submissionAnalytics");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "submission_analytics", "create", `SubmissionAnalytics created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapSubmissionAnalyticsSummary(created, maps);
    }

    async getCompletionMetrics(authUserId: string, email: string, fullName?: string | null): Promise<CompletionMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeCompletionMetrics.listByOrganization(context.organizationId)).map((r) => mapCompletionMetricSummary(r, maps));
    }

    async createCompletionMetric(authUserId: string, email: string, input: CreateCompletionMetricInput, fullName?: string | null): Promise<CompletionMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeCompletionMetrics.create(buildCompletionMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create completionMetrics");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "completion_metrics", "create", `CompletionMetric created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCompletionMetricSummary(created, maps);
    }

    async getUsageTrends(authUserId: string, email: string, fullName?: string | null): Promise<UsageTrendSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeUsageTrends.listByOrganization(context.organizationId)).map((r) => mapUsageTrendSummary(r, maps));
    }

    async createUsageTrend(authUserId: string, email: string, input: CreateUsageTrendInput, fullName?: string | null): Promise<UsageTrendSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeUsageTrends.create(buildUsageTrendPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create usageTrends");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "usage_trends", "create", `UsageTrend created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapUsageTrendSummary(created, maps);
    }

    async getFormMetrics(authUserId: string, email: string, fullName?: string | null): Promise<FormMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfeFormMetrics.listByOrganization(context.organizationId)).map(mapFormMetricSummary);
    }

    async createFormMetric(authUserId: string, email: string, input: CreateFormMetricInput, fullName?: string | null): Promise<FormMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormMetrics.create(buildFormMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formMetrics");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_metrics", "create", `FormMetric created`, created.id));
        return mapFormMetricSummary(created);
    }

    async getFormHealths(authUserId: string, email: string, fullName?: string | null): Promise<FormHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfeFormHealth.listByOrganization(context.organizationId)).map(mapFormHealthSummary);
    }

    async createFormHealth(authUserId: string, email: string, input: CreateFormHealthInput, fullName?: string | null): Promise<FormHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormHealth.create(buildFormHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formHealth");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_health", "create", `FormHealth created`, created.id));
        return mapFormHealthSummary(created);
    }

    async getPendingReviewItems(authUserId: string, email: string, fullName?: string | null): Promise<PendingReviewItemSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfePendingReviewItems.listByOrganization(context.organizationId)).map((r) => mapPendingReviewItemSummary(r, maps));
    }

    async createPendingReviewItem(authUserId: string, email: string, input: CreatePendingReviewItemInput, fullName?: string | null): Promise<PendingReviewItemSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfePendingReviewItems.create(buildPendingReviewItemPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pendingReviewItems");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "pending_review_items", "create", `PendingReviewItem created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPendingReviewItemSummary(created, maps);
    }

    async getFormFailures(authUserId: string, email: string, fullName?: string | null): Promise<FormFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.dfeFormFailures.listByOrganization(context.organizationId)).map((r) => mapFormFailureSummary(r, maps));
    }

    async createFormFailure(authUserId: string, email: string, input: CreateFormFailureInput, fullName?: string | null): Promise<FormFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.dfeFormFailures.create(buildFormFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create formFailures");
        await databaseService.dfeAuditLogs.create(buildDfeAuditPayload(context.organizationId, "form_failures", "create", `FormFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapFormFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfeAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getFormHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.dfeFormHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkRegisterForm(authUserId: string, email: string, input: DfeSdkRegisterFormInput, fullName?: string | null): Promise<DfeSdkRegisterFormResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "register_form", moduleSource: "dynamic_form_engine", inputPayload: { ...input } });
        const created = await this.createFormDefinition(authUserId, email, { formHubId: input.formHubId, formKey: input.formKey, formName: input.formName }, fullName);
        return { formId: created.id, formKey: created.formKey, status: created.status };
    }

    async sdkConfigureValidation(authUserId: string, email: string, input: DfeSdkConfigureValidationInput, fullName?: string | null): Promise<DfeSdkConfigureValidationResult> {
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.ruleKey ?? input.ruleName ?? "validation", limit: 3 });
        const created = await this.createRequiredRule(authUserId, email, { formHubId: input.formHubId, ruleKey: input.ruleKey, ruleName: input.ruleName }, fullName);
        return { ruleId: created.id, ruleKey: created.ruleKey, status: created.status };
    }

    async sdkRunFormSubmission(authUserId: string, email: string, input: DfeSdkRunFormSubmissionInput, fullName?: string | null): Promise<DfeSdkRunFormSubmissionResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        await ai.executeTask({ taskType: "run_form_submission", moduleSource: "dynamic_form_engine", inputPayload: { ...input } });
        const created = await this.createFormSubmission(authUserId, email, { formHubId: input.formHubId, submissionKey: input.submissionKey, submissionName: input.submissionName }, fullName);
        return { submissionId: created.id, submissionKey: created.submissionKey, status: created.status };
    }
}

export const formEngineService = new FormEngineService();
