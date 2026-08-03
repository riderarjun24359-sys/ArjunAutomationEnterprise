"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    FormEngineOverviewPanel,
    FormHubsPanel,
    FormDefinitionsPanel,
    FormCategorysPanel,
    FormVersionsPanel,
    FormDependencysPanel,
    FormSectionsPanel,
    FormTabsPanel,
    FormGroupsPanel,
    RepeatableSectionsPanel,
    FormFieldsPanel,
    FieldOptionsPanel,
    FormulaFieldsPanel,
    MediaFieldsPanel,
    RequiredRulesPanel,
    RegexRulesPanel,
    RangeRulesPanel,
    CrossFieldRulesPanel,
    FormDraftsPanel,
    FormSubmissionsPanel,
    FormReviewsPanel,
    ExecutionAuditEntrysPanel,
    RenderProfilesPanel,
    ThemeConfigsPanel,
    LocalizationPacksPanel,
    SubmissionAnalyticssPanel,
    CompletionMetricsPanel,
    UsageTrendsPanel,
    FormMetricsPanel,
    FormHealthsPanel,
    PendingReviewItemsPanel,
    FormFailuresPanel,
    FormEngineAuditLogsPanel,
    FormEngineSdkPanel,
} from "@/src/modules/form-engine/components/FormEnginePanels";
import { FormEngineStats } from "@/src/modules/form-engine/components/FormEngineStats";
import { DFE_TABS } from "@/src/modules/form-engine/constants";
import { useFormEngine } from "@/src/modules/form-engine/hooks/useFormEngine";

const tabs = [
    { id: DFE_TABS.overview, label: "Overview" },
    { id: DFE_TABS.formHubs, label: "Form Hubs" },
    { id: DFE_TABS.formDefinitions, label: "Form Definitions" },
    { id: DFE_TABS.formCategories, label: "Form Categories" },
    { id: DFE_TABS.formVersions, label: "Form Versions" },
    { id: DFE_TABS.formDependencies, label: "Form Dependencies" },
    { id: DFE_TABS.formSections, label: "Form Sections" },
    { id: DFE_TABS.formTabs, label: "Form Tabs" },
    { id: DFE_TABS.formGroups, label: "Form Groups" },
    { id: DFE_TABS.repeatableSections, label: "Repeatable Sections" },
    { id: DFE_TABS.formFields, label: "Form Fields" },
    { id: DFE_TABS.fieldOptions, label: "Field Options" },
    { id: DFE_TABS.formulaFields, label: "Formula Fields" },
    { id: DFE_TABS.mediaFields, label: "Media Fields" },
    { id: DFE_TABS.requiredRules, label: "Required Rules" },
    { id: DFE_TABS.regexRules, label: "Regex Rules" },
    { id: DFE_TABS.rangeRules, label: "Range Rules" },
    { id: DFE_TABS.crossFieldRules, label: "Cross Field Rules" },
    { id: DFE_TABS.formDrafts, label: "Form Drafts" },
    { id: DFE_TABS.formSubmissions, label: "Form Submissions" },
    { id: DFE_TABS.formReviews, label: "Form Reviews" },
    { id: DFE_TABS.executionAuditEntries, label: "Execution Audit Entries" },
    { id: DFE_TABS.renderProfiles, label: "Render Profiles" },
    { id: DFE_TABS.themeConfigs, label: "Theme Configs" },
    { id: DFE_TABS.localizationPacks, label: "Localization Packs" },
    { id: DFE_TABS.submissionAnalytics, label: "Submission Analytics" },
    { id: DFE_TABS.completionMetrics, label: "Completion Metrics" },
    { id: DFE_TABS.usageTrends, label: "Usage Trends" },
    { id: DFE_TABS.formMetrics, label: "Form Metrics" },
    { id: DFE_TABS.formHealth, label: "Form Health" },
    { id: DFE_TABS.pendingReviewItems, label: "Pending Review Items" },
    { id: DFE_TABS.formFailures, label: "Form Failures" },
    { id: DFE_TABS.auditLogs, label: "Audit Logs" },
    { id: DFE_TABS.api, label: "SDK" },
] as const;

export function FormEnginePage() {
    const formEngine = useFormEngine();
    const [activeTab, setActiveTab] = useState<(typeof DFE_TABS)[keyof typeof DFE_TABS]>(DFE_TABS.overview);

    if (formEngine.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Form Engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-600">V2 Program A Program B Sprint 3</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Form Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: form sections, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and form engine dashboard with security-first audit and the shared Form Engine SDK.
                </p>
            </motion.header>
            <FormEngineStats stats={formEngine.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-amber-600 text-white" : "border border-slate-200 text-slate-600 hover:border-amber-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === DFE_TABS.overview ? <FormEngineOverviewPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formHubs ? <FormHubsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formDefinitions ? <FormDefinitionsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formCategories ? <FormCategorysPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formVersions ? <FormVersionsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formDependencies ? <FormDependencysPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formSections ? <FormSectionsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formTabs ? <FormTabsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formGroups ? <FormGroupsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.repeatableSections ? <RepeatableSectionsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formFields ? <FormFieldsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.fieldOptions ? <FieldOptionsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formulaFields ? <FormulaFieldsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.mediaFields ? <MediaFieldsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.requiredRules ? <RequiredRulesPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.regexRules ? <RegexRulesPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.rangeRules ? <RangeRulesPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.crossFieldRules ? <CrossFieldRulesPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formDrafts ? <FormDraftsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formSubmissions ? <FormSubmissionsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formReviews ? <FormReviewsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.executionAuditEntries ? <ExecutionAuditEntrysPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.renderProfiles ? <RenderProfilesPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.themeConfigs ? <ThemeConfigsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.localizationPacks ? <LocalizationPacksPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.submissionAnalytics ? <SubmissionAnalyticssPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.completionMetrics ? <CompletionMetricsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.usageTrends ? <UsageTrendsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formMetrics ? <FormMetricsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formHealth ? <FormHealthsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.pendingReviewItems ? <PendingReviewItemsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.formFailures ? <FormFailuresPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.auditLogs ? <FormEngineAuditLogsPanel data={formEngine} /> : null}
            {activeTab === DFE_TABS.api ? <FormEngineSdkPanel data={formEngine} /> : null}
        </div>
    );
}
