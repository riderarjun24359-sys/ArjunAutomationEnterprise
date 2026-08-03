"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    TenantLifecycleOpsOverviewPanel,
    TenantContextsPanel,
    LifecycleRecordsPanel,
    LifecycleTransitionsPanel,
    LifecycleEventsPanel,
    ReactivationRequestsPanel,
    WorkspacesPanel,
    EnvironmentSettingsPanel,
    StorageManagementsPanel,
    OperationsControlsPanel,
    OnboardingFlowsPanel,
    OnboardingProgressPanel,
    OnboardingValidationsPanel,
    GoLiveChecklistsPanel,
    MarketplaceModulesPanel,
    ModuleInstallationsPanel,
    ModuleDependencysPanel,
    ModuleCompatibilitysPanel,
    IndustryPacksPanel,
    PackInstallationsPanel,
    PackVersionsPanel,
    PackExportsPanel,
    HealthSnapshotsPanel,
    HealthDimensionsPanel,
    HealthRisksPanel,
    HealthScoresPanel,
    SuccessPlansPanel,
    QuarterlyReviewsPanel,
    RenewalPlansPanel,
    CustomerMilestonesPanel,
    CommercialMetricsPanel,
    GrowthSnapshotsPanel,
    ExpansionOpportunitiesPanel,
    TenantLifecycleOpsSdkPanel,
} from "@/src/modules/tenant-lifecycle-ops/components/TenantLifecycleOpsPanels";
import { TenantLifecycleOpsStats } from "@/src/modules/tenant-lifecycle-ops/components/TenantLifecycleOpsStats";
import { TLO_TABS } from "@/src/modules/tenant-lifecycle-ops/constants";
import { useTenantLifecycleOps } from "@/src/modules/tenant-lifecycle-ops/hooks/useTenantLifecycleOps";

const tabs = [
    { id: TLO_TABS.overview, label: "Overview" },
    { id: TLO_TABS.tenantContexts, label: "Tenant Contexts" },
    { id: TLO_TABS.lifecycleRecords, label: "Lifecycle Records" },
    { id: TLO_TABS.lifecycleTransitions, label: "Lifecycle Transitions" },
    { id: TLO_TABS.lifecycleEvents, label: "Lifecycle Events" },
    { id: TLO_TABS.reactivationRequests, label: "Reactivation Requests" },
    { id: TLO_TABS.workspaces, label: "Workspaces" },
    { id: TLO_TABS.environmentSettings, label: "Environment Settings" },
    { id: TLO_TABS.storageManagement, label: "Storage Management" },
    { id: TLO_TABS.operationsControls, label: "Operations Controls" },
    { id: TLO_TABS.onboardingFlows, label: "Onboarding Flows" },
    { id: TLO_TABS.onboardingProgress, label: "Onboarding Progress" },
    { id: TLO_TABS.onboardingValidations, label: "Onboarding Validations" },
    { id: TLO_TABS.goLiveChecklists, label: "Go-Live Checklists" },
    { id: TLO_TABS.marketplaceModules, label: "Marketplace Modules" },
    { id: TLO_TABS.moduleInstallations, label: "Module Installations" },
    { id: TLO_TABS.moduleDependencies, label: "Module Dependencies" },
    { id: TLO_TABS.moduleCompatibility, label: "Module Compatibility" },
    { id: TLO_TABS.industryPacks, label: "Industry Packs" },
    { id: TLO_TABS.packInstallations, label: "Pack Installations" },
    { id: TLO_TABS.packVersions, label: "Pack Versions" },
    { id: TLO_TABS.packExports, label: "Pack Exports" },
    { id: TLO_TABS.healthSnapshots, label: "Health Snapshots" },
    { id: TLO_TABS.healthDimensions, label: "Health Dimensions" },
    { id: TLO_TABS.healthRisks, label: "Health Risks" },
    { id: TLO_TABS.healthScores, label: "Health Scores" },
    { id: TLO_TABS.successPlans, label: "Success Plans" },
    { id: TLO_TABS.quarterlyReviews, label: "Quarterly Reviews" },
    { id: TLO_TABS.renewalPlans, label: "Renewal Plans" },
    { id: TLO_TABS.customerMilestones, label: "Customer Milestones" },
    { id: TLO_TABS.commercialMetrics, label: "Commercial Metrics" },
    { id: TLO_TABS.growthSnapshots, label: "Growth Snapshots" },
    { id: TLO_TABS.expansionOpportunities, label: "Expansion Opportunities" },
    { id: TLO_TABS.api, label: "SDK" },
] as const;

export function TenantLifecycleOpsPage() {
    const tenantLifecycleOps = useTenantLifecycleOps();
    const [activeTab, setActiveTab] = useState<(typeof TLO_TABS)[keyof typeof TLO_TABS]>(TLO_TABS.overview);

    if (tenantLifecycleOps.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Tenant Lifecycle" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">V2 Program A Sprint 3</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Customer Lifecycle & Tenant Operations</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Customer lifecycle and tenant operations platform: lifecycle management, tenant operations, onboarding, marketplace modules, industry packs, health monitoring, customer success, commercial growth, security-first audit, and the shared Tenant Lifecycle Ops SDK. Pipeline: Lead → Trial → Onboarding → Active → Expansion → Renewal.
                </p>
            </motion.header>
            <TenantLifecycleOpsStats stats={tenantLifecycleOps.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === TLO_TABS.overview ? <TenantLifecycleOpsOverviewPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.tenantContexts ? <TenantContextsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.lifecycleRecords ? <LifecycleRecordsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.lifecycleTransitions ? <LifecycleTransitionsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.lifecycleEvents ? <LifecycleEventsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.reactivationRequests ? <ReactivationRequestsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.workspaces ? <WorkspacesPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.environmentSettings ? <EnvironmentSettingsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.storageManagement ? <StorageManagementsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.operationsControls ? <OperationsControlsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.onboardingFlows ? <OnboardingFlowsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.onboardingProgress ? <OnboardingProgressPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.onboardingValidations ? <OnboardingValidationsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.goLiveChecklists ? <GoLiveChecklistsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.marketplaceModules ? <MarketplaceModulesPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.moduleInstallations ? <ModuleInstallationsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.moduleDependencies ? <ModuleDependencysPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.moduleCompatibility ? <ModuleCompatibilitysPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.industryPacks ? <IndustryPacksPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.packInstallations ? <PackInstallationsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.packVersions ? <PackVersionsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.packExports ? <PackExportsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.healthSnapshots ? <HealthSnapshotsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.healthDimensions ? <HealthDimensionsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.healthRisks ? <HealthRisksPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.healthScores ? <HealthScoresPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.successPlans ? <SuccessPlansPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.quarterlyReviews ? <QuarterlyReviewsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.renewalPlans ? <RenewalPlansPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.customerMilestones ? <CustomerMilestonesPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.commercialMetrics ? <CommercialMetricsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.growthSnapshots ? <GrowthSnapshotsPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.expansionOpportunities ? <ExpansionOpportunitiesPanel data={tenantLifecycleOps} /> : null}
            {activeTab === TLO_TABS.api ? <TenantLifecycleOpsSdkPanel data={tenantLifecycleOps} /> : null}
        </div>
    );
}
