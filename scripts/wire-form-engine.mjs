#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("DfeFormHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/business-process-repositories\";";
    const bpfImportEnd = da.indexOf(anchor) + anchor.length;
    const dfeImport = `
import {
    DfeFormHubRepository,
    DfeFormDefinitionRepository,
    DfeFormCategoryRepository,
    DfeFormVersionRepository,
    DfeFormDependencyRepository,
    DfeFormSectionRepository,
    DfeFormTabRepository,
    DfeFormGroupRepository,
    DfeRepeatableSectionRepository,
    DfeFormFieldRepository,
    DfeFieldOptionRepository,
    DfeFormulaFieldRepository,
    DfeMediaFieldRepository,
    DfeRequiredRuleRepository,
    DfeRegexRuleRepository,
    DfeRangeRuleRepository,
    DfeCrossFieldRuleRepository,
    DfeFormDraftRepository,
    DfeFormSubmissionRepository,
    DfeFormReviewRepository,
    DfeExecutionAuditEntryRepository,
    DfeRenderProfileRepository,
    DfeThemeConfigRepository,
    DfeLocalizationPackRepository,
    DfeSubmissionAnalyticsRepository,
    DfeCompletionMetricRepository,
    DfeUsageTrendRepository,
    DfeFormMetricRepository,
    DfeFormHealthRepository,
    DfePendingReviewItemRepository,
    DfeFormFailureRepository,
    DfeAuditLogRepository,
} from "@/src/modules/database/repositories/form-engine-repositories";
`;
    da = da.slice(0, bpfImportEnd) + dfeImport + da.slice(bpfImportEnd);

    const bpfProp = "    readonly bpfAuditLogs: BpfAuditLogRepository;";
    const dfeProps = `    readonly dfeFormHubs: DfeFormHubRepository;
    readonly dfeFormDefinitions: DfeFormDefinitionRepository;
    readonly dfeFormCategories: DfeFormCategoryRepository;
    readonly dfeFormVersions: DfeFormVersionRepository;
    readonly dfeFormDependencies: DfeFormDependencyRepository;
    readonly dfeFormSections: DfeFormSectionRepository;
    readonly dfeFormTabs: DfeFormTabRepository;
    readonly dfeFormGroups: DfeFormGroupRepository;
    readonly dfeRepeatableSections: DfeRepeatableSectionRepository;
    readonly dfeFormFields: DfeFormFieldRepository;
    readonly dfeFieldOptions: DfeFieldOptionRepository;
    readonly dfeFormulaFields: DfeFormulaFieldRepository;
    readonly dfeMediaFields: DfeMediaFieldRepository;
    readonly dfeRequiredRules: DfeRequiredRuleRepository;
    readonly dfeRegexRules: DfeRegexRuleRepository;
    readonly dfeRangeRules: DfeRangeRuleRepository;
    readonly dfeCrossFieldRules: DfeCrossFieldRuleRepository;
    readonly dfeFormDrafts: DfeFormDraftRepository;
    readonly dfeFormSubmissions: DfeFormSubmissionRepository;
    readonly dfeFormReviews: DfeFormReviewRepository;
    readonly dfeExecutionAuditEntries: DfeExecutionAuditEntryRepository;
    readonly dfeRenderProfiles: DfeRenderProfileRepository;
    readonly dfeThemeConfigs: DfeThemeConfigRepository;
    readonly dfeLocalizationPacks: DfeLocalizationPackRepository;
    readonly dfeSubmissionAnalytics: DfeSubmissionAnalyticsRepository;
    readonly dfeCompletionMetrics: DfeCompletionMetricRepository;
    readonly dfeUsageTrends: DfeUsageTrendRepository;
    readonly dfeFormMetrics: DfeFormMetricRepository;
    readonly dfeFormHealth: DfeFormHealthRepository;
    readonly dfePendingReviewItems: DfePendingReviewItemRepository;
    readonly dfeFormFailures: DfeFormFailureRepository;
    readonly dfeAuditLogs: DfeAuditLogRepository;`;
    da = da.replace(bpfProp, bpfProp + "\n" + dfeProps);

    const bpfCtor = "        this.bpfAuditLogs = new BpfAuditLogRepository();";
    const dfeCtor = `        this.dfeFormHubs = new DfeFormHubRepository();
        this.dfeFormDefinitions = new DfeFormDefinitionRepository();
        this.dfeFormCategories = new DfeFormCategoryRepository();
        this.dfeFormVersions = new DfeFormVersionRepository();
        this.dfeFormDependencies = new DfeFormDependencyRepository();
        this.dfeFormSections = new DfeFormSectionRepository();
        this.dfeFormTabs = new DfeFormTabRepository();
        this.dfeFormGroups = new DfeFormGroupRepository();
        this.dfeRepeatableSections = new DfeRepeatableSectionRepository();
        this.dfeFormFields = new DfeFormFieldRepository();
        this.dfeFieldOptions = new DfeFieldOptionRepository();
        this.dfeFormulaFields = new DfeFormulaFieldRepository();
        this.dfeMediaFields = new DfeMediaFieldRepository();
        this.dfeRequiredRules = new DfeRequiredRuleRepository();
        this.dfeRegexRules = new DfeRegexRuleRepository();
        this.dfeRangeRules = new DfeRangeRuleRepository();
        this.dfeCrossFieldRules = new DfeCrossFieldRuleRepository();
        this.dfeFormDrafts = new DfeFormDraftRepository();
        this.dfeFormSubmissions = new DfeFormSubmissionRepository();
        this.dfeFormReviews = new DfeFormReviewRepository();
        this.dfeExecutionAuditEntries = new DfeExecutionAuditEntryRepository();
        this.dfeRenderProfiles = new DfeRenderProfileRepository();
        this.dfeThemeConfigs = new DfeThemeConfigRepository();
        this.dfeLocalizationPacks = new DfeLocalizationPackRepository();
        this.dfeSubmissionAnalytics = new DfeSubmissionAnalyticsRepository();
        this.dfeCompletionMetrics = new DfeCompletionMetricRepository();
        this.dfeUsageTrends = new DfeUsageTrendRepository();
        this.dfeFormMetrics = new DfeFormMetricRepository();
        this.dfeFormHealth = new DfeFormHealthRepository();
        this.dfePendingReviewItems = new DfePendingReviewItemRepository();
        this.dfeFormFailures = new DfeFormFailureRepository();
        this.dfeAuditLogs = new DfeAuditLogRepository();`;
    da = da.replace(bpfCtor, bpfCtor + "\n" + dfeCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("dfeFormHubs")) {
    ds = ds.replace(
        "    bpfAuditLogs: databaseAccess.bpfAuditLogs,",
        `    bpfAuditLogs: databaseAccess.bpfAuditLogs,
    dfeFormHubs: databaseAccess.dfeFormHubs,
    dfeFormDefinitions: databaseAccess.dfeFormDefinitions,
    dfeFormCategories: databaseAccess.dfeFormCategories,
    dfeFormVersions: databaseAccess.dfeFormVersions,
    dfeFormDependencies: databaseAccess.dfeFormDependencies,
    dfeFormSections: databaseAccess.dfeFormSections,
    dfeFormTabs: databaseAccess.dfeFormTabs,
    dfeFormGroups: databaseAccess.dfeFormGroups,
    dfeRepeatableSections: databaseAccess.dfeRepeatableSections,
    dfeFormFields: databaseAccess.dfeFormFields,
    dfeFieldOptions: databaseAccess.dfeFieldOptions,
    dfeFormulaFields: databaseAccess.dfeFormulaFields,
    dfeMediaFields: databaseAccess.dfeMediaFields,
    dfeRequiredRules: databaseAccess.dfeRequiredRules,
    dfeRegexRules: databaseAccess.dfeRegexRules,
    dfeRangeRules: databaseAccess.dfeRangeRules,
    dfeCrossFieldRules: databaseAccess.dfeCrossFieldRules,
    dfeFormDrafts: databaseAccess.dfeFormDrafts,
    dfeFormSubmissions: databaseAccess.dfeFormSubmissions,
    dfeFormReviews: databaseAccess.dfeFormReviews,
    dfeExecutionAuditEntries: databaseAccess.dfeExecutionAuditEntries,
    dfeRenderProfiles: databaseAccess.dfeRenderProfiles,
    dfeThemeConfigs: databaseAccess.dfeThemeConfigs,
    dfeLocalizationPacks: databaseAccess.dfeLocalizationPacks,
    dfeSubmissionAnalytics: databaseAccess.dfeSubmissionAnalytics,
    dfeCompletionMetrics: databaseAccess.dfeCompletionMetrics,
    dfeUsageTrends: databaseAccess.dfeUsageTrends,
    dfeFormMetrics: databaseAccess.dfeFormMetrics,
    dfeFormHealth: databaseAccess.dfeFormHealth,
    dfePendingReviewItems: databaseAccess.dfePendingReviewItems,
    dfeFormFailures: databaseAccess.dfeFormFailures,
    dfeAuditLogs: databaseAccess.dfeAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for DFE");
