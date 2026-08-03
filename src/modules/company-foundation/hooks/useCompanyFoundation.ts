"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { companyFoundationService } from "@/src/modules/company-foundation/services/company-foundation.service";
import type {
    CompanyHubSummary,
    CreateCompanyHubInput,
    BrandProfileSummary,
    CreateBrandProfileInput,
    LogoAssetSummary,
    CreateLogoAssetInput,
    ThemeConfigSummary,
    CreateThemeConfigInput,
    BrandAssetSummary,
    CreateBrandAssetInput,
    WebsitePageSummary,
    CreateWebsitePageInput,
    WebsiteFeatureSummary,
    CreateWebsiteFeatureInput,
    WebsiteSectionSummary,
    CreateWebsiteSectionInput,
    DemoRequestSummary,
    CreateDemoRequestInput,
    PricingPlanSummary,
    CreatePricingPlanInput,
    PricingPackageSummary,
    CreatePricingPackageInput,
    ModulePricingSummary,
    CreateModulePricingInput,
    DiscountRuleSummary,
    CreateDiscountRuleInput,
    ProposalSummary,
    CreateProposalInput,
    ProposalDocumentSummary,
    CreateProposalDocumentInput,
    ProposalContractSummary,
    CreateProposalContractInput,
    ProposalHistorySummary,
    CreateProposalHistoryInput,
    PortalDashboardSummary,
    CreatePortalDashboardInput,
    PortalSubscriptionSummary,
    CreatePortalSubscriptionInput,
    PortalBillingSummary,
    CreatePortalBillingInput,
    PortalSupportSummary,
    CreatePortalSupportInput,
    DocGuideSummary,
    CreateDocGuideInput,
    DocApiReferenceSummary,
    CreateDocApiReferenceInput,
    DocVersionSummary,
    CreateDocVersionInput,
    DemoOrganizationSummary,
    CreateDemoOrganizationInput,
    DemoDataSetSummary,
    CreateDemoDataSetInput,
    DemoUserSummary,
    CreateDemoUserInput,
    CompanyMetricSummary,
    CreateCompanyMetricInput,
    CompanyHealthSummary,
    CreateCompanyHealthInput,
    ExecutiveKpiSummary,
    CreateExecutiveKpiInput,
    CompanyFailureSummary,
    CreateCompanyFailureInput,
    AuditEntry,
    CmpDashboardStats,
    CmpPipelineInfo,
} from "@/src/modules/company-foundation/types";

export function useCompanyFoundation() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CmpDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<CmpPipelineInfo | null>(null);
    const [companyHubs, setCompanyHubs] = useState<CompanyHubSummary[]>([]);
    const [brandProfiles, setBrandProfiles] = useState<BrandProfileSummary[]>([]);
    const [logoAssets, setLogoAssets] = useState<LogoAssetSummary[]>([]);
    const [themeConfigs, setThemeConfigs] = useState<ThemeConfigSummary[]>([]);
    const [brandAssets, setBrandAssets] = useState<BrandAssetSummary[]>([]);
    const [websitePages, setWebsitePages] = useState<WebsitePageSummary[]>([]);
    const [websiteFeatures, setWebsiteFeatures] = useState<WebsiteFeatureSummary[]>([]);
    const [websiteSections, setWebsiteSections] = useState<WebsiteSectionSummary[]>([]);
    const [demoRequests, setDemoRequests] = useState<DemoRequestSummary[]>([]);
    const [pricingPlans, setPricingPlans] = useState<PricingPlanSummary[]>([]);
    const [pricingPackages, setPricingPackages] = useState<PricingPackageSummary[]>([]);
    const [modulePricing, setModulePricings] = useState<ModulePricingSummary[]>([]);
    const [discountRules, setDiscountRules] = useState<DiscountRuleSummary[]>([]);
    const [proposals, setProposals] = useState<ProposalSummary[]>([]);
    const [proposalDocuments, setProposalDocuments] = useState<ProposalDocumentSummary[]>([]);
    const [proposalContracts, setProposalContracts] = useState<ProposalContractSummary[]>([]);
    const [proposalHistory, setProposalHistorys] = useState<ProposalHistorySummary[]>([]);
    const [portalDashboards, setPortalDashboards] = useState<PortalDashboardSummary[]>([]);
    const [portalSubscriptions, setPortalSubscriptions] = useState<PortalSubscriptionSummary[]>([]);
    const [portalBilling, setPortalBillings] = useState<PortalBillingSummary[]>([]);
    const [portalSupport, setPortalSupports] = useState<PortalSupportSummary[]>([]);
    const [docGuides, setDocGuides] = useState<DocGuideSummary[]>([]);
    const [docApiReferences, setDocApiReferences] = useState<DocApiReferenceSummary[]>([]);
    const [docVersions, setDocVersions] = useState<DocVersionSummary[]>([]);
    const [demoOrganizations, setDemoOrganizations] = useState<DemoOrganizationSummary[]>([]);
    const [demoDataSets, setDemoDataSets] = useState<DemoDataSetSummary[]>([]);
    const [demoUsers, setDemoUsers] = useState<DemoUserSummary[]>([]);
    const [companyMetrics, setCompanyMetrics] = useState<CompanyMetricSummary[]>([]);
    const [companyHealth, setCompanyHealths] = useState<CompanyHealthSummary[]>([]);
    const [executiveKpis, setExecutiveKpis] = useState<ExecutiveKpiSummary[]>([]);
    const [companyFailures, setCompanyFailures] = useState<CompanyFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [companyHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
companyHubsList,
            brandProfilesList,
            logoAssetsList,
            themeConfigsList,
            brandAssetsList,
            websitePagesList,
            websiteFeaturesList,
            websiteSectionsList,
            demoRequestsList,
            pricingPlansList,
            pricingPackagesList,
            modulePricingList,
            discountRulesList,
            proposalsList,
            proposalDocumentsList,
            proposalContractsList,
            proposalHistoryList,
            portalDashboardsList,
            portalSubscriptionsList,
            portalBillingList,
            portalSupportList,
            docGuidesList,
            docApiReferencesList,
            docVersionsList,
            demoOrganizationsList,
            demoDataSetsList,
            demoUsersList,
            companyMetricsList,
            companyHealthList,
            executiveKpisList,
            companyFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            companyFoundationService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(companyFoundationService.getPipelineInfo()),
            companyFoundationService.getCompanyHubs(authUserId, email, fullName),
            companyFoundationService.getBrandProfiles(authUserId, email, fullName),
            companyFoundationService.getLogoAssets(authUserId, email, fullName),
            companyFoundationService.getThemeConfigs(authUserId, email, fullName),
            companyFoundationService.getBrandAssets(authUserId, email, fullName),
            companyFoundationService.getWebsitePages(authUserId, email, fullName),
            companyFoundationService.getWebsiteFeatures(authUserId, email, fullName),
            companyFoundationService.getWebsiteSections(authUserId, email, fullName),
            companyFoundationService.getDemoRequests(authUserId, email, fullName),
            companyFoundationService.getPricingPlans(authUserId, email, fullName),
            companyFoundationService.getPricingPackages(authUserId, email, fullName),
            companyFoundationService.getModulePricings(authUserId, email, fullName),
            companyFoundationService.getDiscountRules(authUserId, email, fullName),
            companyFoundationService.getProposals(authUserId, email, fullName),
            companyFoundationService.getProposalDocuments(authUserId, email, fullName),
            companyFoundationService.getProposalContracts(authUserId, email, fullName),
            companyFoundationService.getProposalHistorys(authUserId, email, fullName),
            companyFoundationService.getPortalDashboards(authUserId, email, fullName),
            companyFoundationService.getPortalSubscriptions(authUserId, email, fullName),
            companyFoundationService.getPortalBillings(authUserId, email, fullName),
            companyFoundationService.getPortalSupports(authUserId, email, fullName),
            companyFoundationService.getDocGuides(authUserId, email, fullName),
            companyFoundationService.getDocApiReferences(authUserId, email, fullName),
            companyFoundationService.getDocVersions(authUserId, email, fullName),
            companyFoundationService.getDemoOrganizations(authUserId, email, fullName),
            companyFoundationService.getDemoDataSets(authUserId, email, fullName),
            companyFoundationService.getDemoUsers(authUserId, email, fullName),
            companyFoundationService.getCompanyMetrics(authUserId, email, fullName),
            companyFoundationService.getCompanyHealths(authUserId, email, fullName),
            companyFoundationService.getExecutiveKpis(authUserId, email, fullName),
            companyFoundationService.getCompanyFailures(authUserId, email, fullName),
            companyFoundationService.getAuditLogs(authUserId, email, fullName),
            companyFoundationService.getCompanyHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
companyHubsList,
            brandProfilesList,
            logoAssetsList,
            themeConfigsList,
            brandAssetsList,
            websitePagesList,
            websiteFeaturesList,
            websiteSectionsList,
            demoRequestsList,
            pricingPlansList,
            pricingPackagesList,
            modulePricingList,
            discountRulesList,
            proposalsList,
            proposalDocumentsList,
            proposalContractsList,
            proposalHistoryList,
            portalDashboardsList,
            portalSubscriptionsList,
            portalBillingList,
            portalSupportList,
            docGuidesList,
            docApiReferencesList,
            docVersionsList,
            demoOrganizationsList,
            demoDataSetsList,
            demoUsersList,
            companyMetricsList,
            companyHealthList,
            executiveKpisList,
            companyFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setCompanyHubs(result.companyHubsList);
        setBrandProfiles(result.brandProfilesList);
        setLogoAssets(result.logoAssetsList);
        setThemeConfigs(result.themeConfigsList);
        setBrandAssets(result.brandAssetsList);
        setWebsitePages(result.websitePagesList);
        setWebsiteFeatures(result.websiteFeaturesList);
        setWebsiteSections(result.websiteSectionsList);
        setDemoRequests(result.demoRequestsList);
        setPricingPlans(result.pricingPlansList);
        setPricingPackages(result.pricingPackagesList);
        setModulePricings(result.modulePricingList);
        setDiscountRules(result.discountRulesList);
        setProposals(result.proposalsList);
        setProposalDocuments(result.proposalDocumentsList);
        setProposalContracts(result.proposalContractsList);
        setProposalHistorys(result.proposalHistoryList);
        setPortalDashboards(result.portalDashboardsList);
        setPortalSubscriptions(result.portalSubscriptionsList);
        setPortalBillings(result.portalBillingList);
        setPortalSupports(result.portalSupportList);
        setDocGuides(result.docGuidesList);
        setDocApiReferences(result.docApiReferencesList);
        setDocVersions(result.docVersionsList);
        setDemoOrganizations(result.demoOrganizationsList);
        setDemoDataSets(result.demoDataSetsList);
        setDemoUsers(result.demoUsersList);
        setCompanyMetrics(result.companyMetricsList);
        setCompanyHealths(result.companyHealthList);
        setExecutiveKpis(result.executiveKpisList);
        setCompanyFailures(result.companyFailuresList);
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

    const createCompanyHub = useCallback(async (input: CreateCompanyHubInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createCompanyHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrandProfile = useCallback(async (input: CreateBrandProfileInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createBrandProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLogoAsset = useCallback(async (input: CreateLogoAssetInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createLogoAsset(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createThemeConfig = useCallback(async (input: CreateThemeConfigInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createThemeConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBrandAsset = useCallback(async (input: CreateBrandAssetInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createBrandAsset(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWebsitePage = useCallback(async (input: CreateWebsitePageInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createWebsitePage(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWebsiteFeature = useCallback(async (input: CreateWebsiteFeatureInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createWebsiteFeature(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWebsiteSection = useCallback(async (input: CreateWebsiteSectionInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createWebsiteSection(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDemoRequest = useCallback(async (input: CreateDemoRequestInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createDemoRequest(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPricingPlan = useCallback(async (input: CreatePricingPlanInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createPricingPlan(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPricingPackage = useCallback(async (input: CreatePricingPackageInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createPricingPackage(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createModulePricing = useCallback(async (input: CreateModulePricingInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createModulePricing(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDiscountRule = useCallback(async (input: CreateDiscountRuleInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createDiscountRule(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProposal = useCallback(async (input: CreateProposalInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createProposal(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProposalDocument = useCallback(async (input: CreateProposalDocumentInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createProposalDocument(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProposalContract = useCallback(async (input: CreateProposalContractInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createProposalContract(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProposalHistory = useCallback(async (input: CreateProposalHistoryInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createProposalHistory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPortalDashboard = useCallback(async (input: CreatePortalDashboardInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createPortalDashboard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPortalSubscription = useCallback(async (input: CreatePortalSubscriptionInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createPortalSubscription(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPortalBilling = useCallback(async (input: CreatePortalBillingInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createPortalBilling(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPortalSupport = useCallback(async (input: CreatePortalSupportInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createPortalSupport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocGuide = useCallback(async (input: CreateDocGuideInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createDocGuide(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocApiReference = useCallback(async (input: CreateDocApiReferenceInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createDocApiReference(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocVersion = useCallback(async (input: CreateDocVersionInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createDocVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDemoOrganization = useCallback(async (input: CreateDemoOrganizationInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createDemoOrganization(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDemoDataSet = useCallback(async (input: CreateDemoDataSetInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createDemoDataSet(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDemoUser = useCallback(async (input: CreateDemoUserInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createDemoUser(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCompanyMetric = useCallback(async (input: CreateCompanyMetricInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createCompanyMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCompanyHealth = useCallback(async (input: CreateCompanyHealthInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createCompanyHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveKpi = useCallback(async (input: CreateExecutiveKpiInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createExecutiveKpi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCompanyFailure = useCallback(async (input: CreateCompanyFailureInput) => { if (!user) throw new Error("Authentication required"); await companyFoundationService.createCompanyFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        companyHubs,
        createCompanyHub,
        brandProfiles,
        createBrandProfile,
        logoAssets,
        createLogoAsset,
        themeConfigs,
        createThemeConfig,
        brandAssets,
        createBrandAsset,
        websitePages,
        createWebsitePage,
        websiteFeatures,
        createWebsiteFeature,
        websiteSections,
        createWebsiteSection,
        demoRequests,
        createDemoRequest,
        pricingPlans,
        createPricingPlan,
        pricingPackages,
        createPricingPackage,
        modulePricing,
        createModulePricing,
        discountRules,
        createDiscountRule,
        proposals,
        createProposal,
        proposalDocuments,
        createProposalDocument,
        proposalContracts,
        createProposalContract,
        proposalHistory,
        createProposalHistory,
        portalDashboards,
        createPortalDashboard,
        portalSubscriptions,
        createPortalSubscription,
        portalBilling,
        createPortalBilling,
        portalSupport,
        createPortalSupport,
        docGuides,
        createDocGuide,
        docApiReferences,
        createDocApiReference,
        docVersions,
        createDocVersion,
        demoOrganizations,
        createDemoOrganization,
        demoDataSets,
        createDemoDataSet,
        demoUsers,
        createDemoUser,
        companyMetrics,
        createCompanyMetric,
        companyHealth,
        createCompanyHealth,
        executiveKpis,
        createExecutiveKpi,
        companyFailures,
        createCompanyFailure,
        auditLogs,
        companyHubOptions,
        refresh,
    };
}
