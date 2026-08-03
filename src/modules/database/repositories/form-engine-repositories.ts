import type {
    DbDfeFormHub,
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
    DbDfeAuditLog,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgDfeRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;
        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;
        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

export class DfeFormHubRepository extends OrgDfeRepository<DbDfeFormHub> { protected table = "dfe_form_hubs"; }
export class DfeFormDefinitionRepository extends OrgDfeRepository<DbDfeFormDefinition> { protected table = "dfe_form_definitions"; }
export class DfeFormCategoryRepository extends OrgDfeRepository<DbDfeFormCategory> { protected table = "dfe_form_categories"; }
export class DfeFormVersionRepository extends OrgDfeRepository<DbDfeFormVersion> { protected table = "dfe_form_versions"; }
export class DfeFormDependencyRepository extends OrgDfeRepository<DbDfeFormDependency> { protected table = "dfe_form_dependencies"; }
export class DfeFormSectionRepository extends OrgDfeRepository<DbDfeFormSection> { protected table = "dfe_form_sections"; }
export class DfeFormTabRepository extends OrgDfeRepository<DbDfeFormTab> { protected table = "dfe_form_tabs"; }
export class DfeFormGroupRepository extends OrgDfeRepository<DbDfeFormGroup> { protected table = "dfe_form_groups"; }
export class DfeRepeatableSectionRepository extends OrgDfeRepository<DbDfeRepeatableSection> { protected table = "dfe_repeatable_sections"; }
export class DfeFormFieldRepository extends OrgDfeRepository<DbDfeFormField> { protected table = "dfe_form_fields"; }
export class DfeFieldOptionRepository extends OrgDfeRepository<DbDfeFieldOption> { protected table = "dfe_field_options"; }
export class DfeFormulaFieldRepository extends OrgDfeRepository<DbDfeFormulaField> { protected table = "dfe_formula_fields"; }
export class DfeMediaFieldRepository extends OrgDfeRepository<DbDfeMediaField> { protected table = "dfe_media_fields"; }
export class DfeRequiredRuleRepository extends OrgDfeRepository<DbDfeRequiredRule> { protected table = "dfe_required_rules"; }
export class DfeRegexRuleRepository extends OrgDfeRepository<DbDfeRegexRule> { protected table = "dfe_regex_rules"; }
export class DfeRangeRuleRepository extends OrgDfeRepository<DbDfeRangeRule> { protected table = "dfe_range_rules"; }
export class DfeCrossFieldRuleRepository extends OrgDfeRepository<DbDfeCrossFieldRule> { protected table = "dfe_cross_field_rules"; }
export class DfeFormDraftRepository extends OrgDfeRepository<DbDfeFormDraft> { protected table = "dfe_form_drafts"; }
export class DfeFormSubmissionRepository extends OrgDfeRepository<DbDfeFormSubmission> { protected table = "dfe_form_submissions"; }
export class DfeFormReviewRepository extends OrgDfeRepository<DbDfeFormReview> { protected table = "dfe_form_reviews"; }
export class DfeExecutionAuditEntryRepository extends OrgDfeRepository<DbDfeExecutionAuditEntry> { protected table = "dfe_execution_audit_entries"; }
export class DfeRenderProfileRepository extends OrgDfeRepository<DbDfeRenderProfile> { protected table = "dfe_render_profiles"; }
export class DfeThemeConfigRepository extends OrgDfeRepository<DbDfeThemeConfig> { protected table = "dfe_theme_configs"; }
export class DfeLocalizationPackRepository extends OrgDfeRepository<DbDfeLocalizationPack> { protected table = "dfe_localization_packs"; }
export class DfeSubmissionAnalyticsRepository extends OrgDfeRepository<DbDfeSubmissionAnalytics> { protected table = "dfe_submission_analytics"; }
export class DfeCompletionMetricRepository extends OrgDfeRepository<DbDfeCompletionMetric> { protected table = "dfe_completion_metrics"; }
export class DfeUsageTrendRepository extends OrgDfeRepository<DbDfeUsageTrend> { protected table = "dfe_usage_trends"; }
export class DfeFormMetricRepository extends OrgDfeRepository<DbDfeFormMetric> { protected table = "dfe_form_metrics"; }
export class DfeFormHealthRepository extends OrgDfeRepository<DbDfeFormHealth> { protected table = "dfe_form_health"; }
export class DfePendingReviewItemRepository extends OrgDfeRepository<DbDfePendingReviewItem> { protected table = "dfe_pending_review_items"; }
export class DfeFormFailureRepository extends OrgDfeRepository<DbDfeFormFailure> { protected table = "dfe_form_failures"; }
export class DfeAuditLogRepository extends OrgDfeRepository<DbDfeAuditLog> { protected table = "dfe_audit_logs"; }
