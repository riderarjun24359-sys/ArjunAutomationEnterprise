"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    CommercialSaasOverviewPanel,
    TenantsPanel,
    RegistrationsPanel,
    TenantProfilesPanel,
    DomainsPanel,
    EmailVerificationPanel,
    TrialsPanel,
    WorkspaceSetupPanel,
    RoleProvisionsPanel,
    WelcomeExperiencePanel,
    SubscriptionsPanel,
    PlanLimitsPanel,
    SubscriptionEventsPanel,
    LicensesPanel,
    LicenseAllocationsPanel,
    FeatureFlagsPanel,
    PortalSettingsPanel,
    PortalBrandingPanel,
    PortalIntegrationsPanel,
    PortalApiKeysPanel,
    UsageMetersPanel,
    UsageRecordsPanel,
    InvoicesPanel,
    BillingCreditsPanel,
    BillingCouponsPanel,
    RecurringBillingPanel,
    HealthScoresPanel,
    OnboardingChecklistsPanel,
    ProductAdoptionPanel,
    RenewalTrackingPanel,
    SupportSummariesPanel,
    AdminMetricsPanel,
    SaasAuditPanel,
    CommercialSaasSdkPanel,
} from "@/src/modules/commercial-saas/components/CommercialSaasPanels";
import { CommercialSaasStats } from "@/src/modules/commercial-saas/components/CommercialSaasStats";
import { COMMERCIAL_SAAS_TABS } from "@/src/modules/commercial-saas/constants";
import { useCommercialSaas } from "@/src/modules/commercial-saas/hooks/useCommercialSaas";

const tabs = [
    { id: COMMERCIAL_SAAS_TABS.overview, label: "Overview" },
    { id: COMMERCIAL_SAAS_TABS.tenants, label: "Tenants" },
    { id: COMMERCIAL_SAAS_TABS.registrations, label: "Registrations" },
    { id: COMMERCIAL_SAAS_TABS.tenantProfiles, label: "Tenant Profiles" },
    { id: COMMERCIAL_SAAS_TABS.domains, label: "Domains" },
    { id: COMMERCIAL_SAAS_TABS.emailVerification, label: "Email Verification" },
    { id: COMMERCIAL_SAAS_TABS.trials, label: "Trials" },
    { id: COMMERCIAL_SAAS_TABS.workspaceSetup, label: "Workspace Setup" },
    { id: COMMERCIAL_SAAS_TABS.roleProvisions, label: "Role Provisions" },
    { id: COMMERCIAL_SAAS_TABS.welcomeExperience, label: "Welcome Experience" },
    { id: COMMERCIAL_SAAS_TABS.subscriptions, label: "Subscriptions" },
    { id: COMMERCIAL_SAAS_TABS.planLimits, label: "Plan Limits" },
    { id: COMMERCIAL_SAAS_TABS.subscriptionEvents, label: "Subscription Events" },
    { id: COMMERCIAL_SAAS_TABS.licenses, label: "Licenses" },
    { id: COMMERCIAL_SAAS_TABS.licenseAllocations, label: "License Allocations" },
    { id: COMMERCIAL_SAAS_TABS.featureFlags, label: "Feature Flags" },
    { id: COMMERCIAL_SAAS_TABS.portalSettings, label: "Portal Settings" },
    { id: COMMERCIAL_SAAS_TABS.portalBranding, label: "Portal Branding" },
    { id: COMMERCIAL_SAAS_TABS.portalIntegrations, label: "Portal Integrations" },
    { id: COMMERCIAL_SAAS_TABS.portalApiKeys, label: "Portal API Keys" },
    { id: COMMERCIAL_SAAS_TABS.usageMeters, label: "Usage Meters" },
    { id: COMMERCIAL_SAAS_TABS.usageRecords, label: "Usage Records" },
    { id: COMMERCIAL_SAAS_TABS.invoices, label: "Invoices" },
    { id: COMMERCIAL_SAAS_TABS.billingCredits, label: "Billing Credits" },
    { id: COMMERCIAL_SAAS_TABS.billingCoupons, label: "Billing Coupons" },
    { id: COMMERCIAL_SAAS_TABS.recurringBilling, label: "Recurring Billing" },
    { id: COMMERCIAL_SAAS_TABS.healthScores, label: "Health Scores" },
    { id: COMMERCIAL_SAAS_TABS.onboardingChecklists, label: "Onboarding Checklists" },
    { id: COMMERCIAL_SAAS_TABS.productAdoption, label: "Product Adoption" },
    { id: COMMERCIAL_SAAS_TABS.renewalTracking, label: "Renewal Tracking" },
    { id: COMMERCIAL_SAAS_TABS.supportSummaries, label: "Support Summaries" },
    { id: COMMERCIAL_SAAS_TABS.adminMetrics, label: "Admin Metrics" },
    { id: COMMERCIAL_SAAS_TABS.audit, label: "Audit" },
    { id: COMMERCIAL_SAAS_TABS.api, label: "SDK" },
] as const;

export function CommercialSaasPage() {
    const commercialSaas = useCommercialSaas();
    const [activeTab, setActiveTab] = useState<(typeof COMMERCIAL_SAAS_TABS)[keyof typeof COMMERCIAL_SAAS_TABS]>(COMMERCIAL_SAAS_TABS.overview);

    if (commercialSaas.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Commercial Platform" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">V2 Program A Sprint 1</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Commercial Multi-Tenant SaaS Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Commercial multi-tenant SaaS platform: tenant registration, profiles, domains, email verification, trials, workspace setup, role provisions, welcome experiences, subscriptions, plan limits, licenses, feature flags, portal settings, branding, integrations, API keys, usage meters, billing, customer success metrics, admin metrics, security-first audit, and the shared Commercial SaaS SDK. Pipeline: Trial → Starter → Growth → Professional → Enterprise.
                </p>
            </motion.header>
            <CommercialSaasStats stats={commercialSaas.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-sky-600 text-white" : "border border-slate-200 text-slate-600 hover:border-sky-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === COMMERCIAL_SAAS_TABS.overview ? <CommercialSaasOverviewPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.tenants ? <TenantsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.registrations ? <RegistrationsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.tenantProfiles ? <TenantProfilesPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.domains ? <DomainsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.emailVerification ? <EmailVerificationPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.trials ? <TrialsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.workspaceSetup ? <WorkspaceSetupPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.roleProvisions ? <RoleProvisionsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.welcomeExperience ? <WelcomeExperiencePanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.subscriptions ? <SubscriptionsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.planLimits ? <PlanLimitsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.subscriptionEvents ? <SubscriptionEventsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.licenses ? <LicensesPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.licenseAllocations ? <LicenseAllocationsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.featureFlags ? <FeatureFlagsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.portalSettings ? <PortalSettingsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.portalBranding ? <PortalBrandingPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.portalIntegrations ? <PortalIntegrationsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.portalApiKeys ? <PortalApiKeysPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.usageMeters ? <UsageMetersPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.usageRecords ? <UsageRecordsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.invoices ? <InvoicesPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.billingCredits ? <BillingCreditsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.billingCoupons ? <BillingCouponsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.recurringBilling ? <RecurringBillingPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.healthScores ? <HealthScoresPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.onboardingChecklists ? <OnboardingChecklistsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.productAdoption ? <ProductAdoptionPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.renewalTracking ? <RenewalTrackingPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.supportSummaries ? <SupportSummariesPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.adminMetrics ? <AdminMetricsPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.audit ? <SaasAuditPanel data={commercialSaas} /> : null}
            {activeTab === COMMERCIAL_SAAS_TABS.api ? <CommercialSaasSdkPanel data={commercialSaas} /> : null}
        </div>
    );
}
