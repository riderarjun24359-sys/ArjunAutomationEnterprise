"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    CompanyFoundationOverviewPanel,
    CompanyHubsPanel,
    BrandProfilesPanel,
    LogoAssetsPanel,
    ThemeConfigsPanel,
    BrandAssetsPanel,
    WebsitePagesPanel,
    WebsiteFeaturesPanel,
    WebsiteSectionsPanel,
    DemoRequestsPanel,
    PricingPlansPanel,
    PricingPackagesPanel,
    ModulePricingsPanel,
    DiscountRulesPanel,
    ProposalsPanel,
    ProposalDocumentsPanel,
    ProposalContractsPanel,
    ProposalHistorysPanel,
    PortalDashboardsPanel,
    PortalSubscriptionsPanel,
    PortalBillingsPanel,
    PortalSupportsPanel,
    DocGuidesPanel,
    DocApiReferencesPanel,
    DocVersionsPanel,
    DemoOrganizationsPanel,
    DemoDataSetsPanel,
    DemoUsersPanel,
    CompanyMetricsPanel,
    CompanyHealthsPanel,
    ExecutiveKpisPanel,
    CompanyFailuresPanel,
    RetailAuditLogsPanel,
    RetailSdkPanel,
} from "@/src/modules/company-foundation/components/CompanyFoundationPanels";
import { CompanyFoundationStats } from "@/src/modules/company-foundation/components/CompanyFoundationStats";
import { CMP_TABS } from "@/src/modules/company-foundation/constants";
import { useCompanyFoundation } from "@/src/modules/company-foundation/hooks/useCompanyFoundation";

const tabs = [
    { id: CMP_TABS.overview, label: "Overview" },
    { id: CMP_TABS.companyHubs, label: "Company Hubs" },
    { id: CMP_TABS.brandProfiles, label: "Brand Profiles" },
    { id: CMP_TABS.logoAssets, label: "Logo Assets" },
    { id: CMP_TABS.themeConfigs, label: "Theme Configs" },
    { id: CMP_TABS.brandAssets, label: "Brand Assets" },
    { id: CMP_TABS.websitePages, label: "Website Pages" },
    { id: CMP_TABS.websiteFeatures, label: "Website Features" },
    { id: CMP_TABS.websiteSections, label: "Website Sections" },
    { id: CMP_TABS.demoRequests, label: "Demo Requests" },
    { id: CMP_TABS.pricingPlans, label: "Pricing Plans" },
    { id: CMP_TABS.pricingPackages, label: "Pricing Packages" },
    { id: CMP_TABS.modulePricing, label: "Module Pricing" },
    { id: CMP_TABS.discountRules, label: "Discount Rules" },
    { id: CMP_TABS.proposals, label: "Proposals" },
    { id: CMP_TABS.proposalDocuments, label: "Proposal Documents" },
    { id: CMP_TABS.proposalContracts, label: "Proposal Contracts" },
    { id: CMP_TABS.proposalHistory, label: "Proposal History" },
    { id: CMP_TABS.portalDashboards, label: "Portal Dashboards" },
    { id: CMP_TABS.portalSubscriptions, label: "Portal Subscriptions" },
    { id: CMP_TABS.portalBilling, label: "Portal Billing" },
    { id: CMP_TABS.portalSupport, label: "Portal Support" },
    { id: CMP_TABS.docGuides, label: "Doc Guides" },
    { id: CMP_TABS.docApiReferences, label: "Doc Api References" },
    { id: CMP_TABS.docVersions, label: "Doc Versions" },
    { id: CMP_TABS.demoOrganizations, label: "Demo Organizations" },
    { id: CMP_TABS.demoDataSets, label: "Demo Data Sets" },
    { id: CMP_TABS.demoUsers, label: "Demo Users" },
    { id: CMP_TABS.companyMetrics, label: "Company Metrics" },
    { id: CMP_TABS.companyHealth, label: "Company Health" },
    { id: CMP_TABS.executiveKpis, label: "Executive Kpis" },
    { id: CMP_TABS.companyFailures, label: "Company Failures" },
    { id: CMP_TABS.auditLogs, label: "Audit Logs" },
    { id: CMP_TABS.api, label: "SDK" },
] as const;

export function CompanyFoundationPage() {
    const retail = useCompanyFoundation();
    const [activeTab, setActiveTab] = useState<(typeof CMP_TABS)[keyof typeof CMP_TABS]>(CMP_TABS.overview);

    if (retail.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Company Foundation" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-emerald-900 dark:text-emerald-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-emerald-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">V2 Program A Program F Wave 1</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Company Foundation</h1>
                <p className="mt-3 max-w-2xl text-sm text-emerald-500 dark:text-emerald-400">
                    Integration layer for the entire SaaS platform: dining areas, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and retail operating system dashboard with security-first audit and the shared Company Foundation SDK.
                </p>
            </motion.header>
            <CompanyFoundationStats stats={retail.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-emerald-600 text-white" : "border border-slate-200 text-emerald-600 hover:border-emerald-300 dark:border-slate-800 dark:text-emerald-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === CMP_TABS.overview ? <CompanyFoundationOverviewPanel data={retail} /> : null}
            {activeTab === CMP_TABS.companyHubs ? <CompanyHubsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.brandProfiles ? <BrandProfilesPanel data={retail} /> : null}
            {activeTab === CMP_TABS.logoAssets ? <LogoAssetsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.themeConfigs ? <ThemeConfigsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.brandAssets ? <BrandAssetsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.websitePages ? <WebsitePagesPanel data={retail} /> : null}
            {activeTab === CMP_TABS.websiteFeatures ? <WebsiteFeaturesPanel data={retail} /> : null}
            {activeTab === CMP_TABS.websiteSections ? <WebsiteSectionsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.demoRequests ? <DemoRequestsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.pricingPlans ? <PricingPlansPanel data={retail} /> : null}
            {activeTab === CMP_TABS.pricingPackages ? <PricingPackagesPanel data={retail} /> : null}
            {activeTab === CMP_TABS.modulePricing ? <ModulePricingsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.discountRules ? <DiscountRulesPanel data={retail} /> : null}
            {activeTab === CMP_TABS.proposals ? <ProposalsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.proposalDocuments ? <ProposalDocumentsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.proposalContracts ? <ProposalContractsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.proposalHistory ? <ProposalHistorysPanel data={retail} /> : null}
            {activeTab === CMP_TABS.portalDashboards ? <PortalDashboardsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.portalSubscriptions ? <PortalSubscriptionsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.portalBilling ? <PortalBillingsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.portalSupport ? <PortalSupportsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.docGuides ? <DocGuidesPanel data={retail} /> : null}
            {activeTab === CMP_TABS.docApiReferences ? <DocApiReferencesPanel data={retail} /> : null}
            {activeTab === CMP_TABS.docVersions ? <DocVersionsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.demoOrganizations ? <DemoOrganizationsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.demoDataSets ? <DemoDataSetsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.demoUsers ? <DemoUsersPanel data={retail} /> : null}
            {activeTab === CMP_TABS.companyMetrics ? <CompanyMetricsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.companyHealth ? <CompanyHealthsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.executiveKpis ? <ExecutiveKpisPanel data={retail} /> : null}
            {activeTab === CMP_TABS.companyFailures ? <CompanyFailuresPanel data={retail} /> : null}
            {activeTab === CMP_TABS.auditLogs ? <RetailAuditLogsPanel data={retail} /> : null}
            {activeTab === CMP_TABS.api ? <RetailSdkPanel data={retail} /> : null}
        </div>
    );
}
