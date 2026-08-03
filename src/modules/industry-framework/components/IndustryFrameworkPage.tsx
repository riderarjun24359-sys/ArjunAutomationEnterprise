"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    IndustryFrameworkOverviewPanel,
    FrameworkHubsPanel,
    IndustryRegistrationsPanel,
    IndustryMetadatasPanel,
    IndustryVersionsPanel,
    IndustryDependencysPanel,
    BusinessTypesPanel,
    BusinessSizesPanel,
    OperatingModelsPanel,
    IndustryProfilesPanel,
    DashboardTemplatesPanel,
    WorkflowTemplatesPanel,
    RoleTemplatesPanel,
    ReportTemplatesPanel,
    DynamicConfigurationsPanel,
    FeatureConfigurationsPanel,
    BusinessRulesPanel,
    ValidationRulesPanel,
    IndustryContextsPanel,
    AiContextsPanel,
    TerminologyEntrysPanel,
    DemoProfilesPanel,
    ProductionProfilesPanel,
    EnterpriseProfilesPanel,
    SharedApisPanel,
    ContextApisPanel,
    ConfigurationApisPanel,
    ExtensionPointsPanel,
    FrameworkMetricsPanel,
    FrameworkHealthsPanel,
    CompatibilityChecksPanel,
    FrameworkFailuresPanel,
    IndustryFrameworkAuditLogsPanel,
    IndustryFrameworkSdkPanel,
} from "@/src/modules/industry-framework/components/IndustryFrameworkPanels";
import { IndustryFrameworkStats } from "@/src/modules/industry-framework/components/IndustryFrameworkStats";
import { IFR_TABS } from "@/src/modules/industry-framework/constants";
import { useIndustryFramework } from "@/src/modules/industry-framework/hooks/useIndustryFramework";

const tabs = [
    { id: IFR_TABS.overview, label: "Overview" },
    { id: IFR_TABS.frameworkHubs, label: "Framework Hubs" },
    { id: IFR_TABS.industryRegistrations, label: "Industry Registrations" },
    { id: IFR_TABS.industryMetadata, label: "Industry Metadata" },
    { id: IFR_TABS.industryVersions, label: "Industry Versions" },
    { id: IFR_TABS.industryDependencies, label: "Industry Dependencies" },
    { id: IFR_TABS.businessTypes, label: "Business Types" },
    { id: IFR_TABS.businessSizes, label: "Business Sizes" },
    { id: IFR_TABS.operatingModels, label: "Operating Models" },
    { id: IFR_TABS.industryProfiles, label: "Industry Profiles" },
    { id: IFR_TABS.dashboardTemplates, label: "Dashboard Templates" },
    { id: IFR_TABS.workflowTemplates, label: "Workflow Templates" },
    { id: IFR_TABS.roleTemplates, label: "Role Templates" },
    { id: IFR_TABS.reportTemplates, label: "Report Templates" },
    { id: IFR_TABS.dynamicConfigurations, label: "Dynamic Configurations" },
    { id: IFR_TABS.featureConfigurations, label: "Feature Configurations" },
    { id: IFR_TABS.businessRules, label: "Business Rules" },
    { id: IFR_TABS.validationRules, label: "Validation Rules" },
    { id: IFR_TABS.industryContexts, label: "Industry Contexts" },
    { id: IFR_TABS.aiContexts, label: "Ai Contexts" },
    { id: IFR_TABS.terminologyEntries, label: "Terminology Entries" },
    { id: IFR_TABS.demoProfiles, label: "Demo Profiles" },
    { id: IFR_TABS.productionProfiles, label: "Production Profiles" },
    { id: IFR_TABS.enterpriseProfiles, label: "Enterprise Profiles" },
    { id: IFR_TABS.sharedApis, label: "Shared Apis" },
    { id: IFR_TABS.contextApis, label: "Context Apis" },
    { id: IFR_TABS.configurationApis, label: "Configuration Apis" },
    { id: IFR_TABS.extensionPoints, label: "Extension Points" },
    { id: IFR_TABS.frameworkMetrics, label: "Framework Metrics" },
    { id: IFR_TABS.frameworkHealth, label: "Framework Health" },
    { id: IFR_TABS.compatibilityChecks, label: "Compatibility Checks" },
    { id: IFR_TABS.frameworkFailures, label: "Framework Failures" },
    { id: IFR_TABS.auditLogs, label: "Audit Logs" },
    { id: IFR_TABS.api, label: "SDK" },
] as const;

export function IndustryFrameworkPage() {
    const industryFramework = useIndustryFramework();
    const [activeTab, setActiveTab] = useState<(typeof IFR_TABS)[keyof typeof IFR_TABS]>(IFR_TABS.overview);

    if (industryFramework.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Industry Framework" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-600">V2 Program A Program B Sprint 1</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Industry Framework</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: dashboard templates, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and industry framework dashboard with security-first audit and the shared Industry Framework SDK.
                </p>
            </motion.header>
            <IndustryFrameworkStats stats={industryFramework.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-teal-600 text-white" : "border border-slate-200 text-slate-600 hover:border-teal-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === IFR_TABS.overview ? <IndustryFrameworkOverviewPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.frameworkHubs ? <FrameworkHubsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.industryRegistrations ? <IndustryRegistrationsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.industryMetadata ? <IndustryMetadatasPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.industryVersions ? <IndustryVersionsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.industryDependencies ? <IndustryDependencysPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.businessTypes ? <BusinessTypesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.businessSizes ? <BusinessSizesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.operatingModels ? <OperatingModelsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.industryProfiles ? <IndustryProfilesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.dashboardTemplates ? <DashboardTemplatesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.workflowTemplates ? <WorkflowTemplatesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.roleTemplates ? <RoleTemplatesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.reportTemplates ? <ReportTemplatesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.dynamicConfigurations ? <DynamicConfigurationsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.featureConfigurations ? <FeatureConfigurationsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.businessRules ? <BusinessRulesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.validationRules ? <ValidationRulesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.industryContexts ? <IndustryContextsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.aiContexts ? <AiContextsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.terminologyEntries ? <TerminologyEntrysPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.demoProfiles ? <DemoProfilesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.productionProfiles ? <ProductionProfilesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.enterpriseProfiles ? <EnterpriseProfilesPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.sharedApis ? <SharedApisPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.contextApis ? <ContextApisPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.configurationApis ? <ConfigurationApisPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.extensionPoints ? <ExtensionPointsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.frameworkMetrics ? <FrameworkMetricsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.frameworkHealth ? <FrameworkHealthsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.compatibilityChecks ? <CompatibilityChecksPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.frameworkFailures ? <FrameworkFailuresPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.auditLogs ? <IndustryFrameworkAuditLogsPanel data={industryFramework} /> : null}
            {activeTab === IFR_TABS.api ? <IndustryFrameworkSdkPanel data={industryFramework} /> : null}
        </div>
    );
}
