export interface CmpDashboardStats {
    totalCompanyHubs: number;
    activeCompanyHubs: number;
    brandProfileCount: number;
    websitePageCount: number;
    pricingPlanCount: number;
    proposalCount: number;
    portalDashboardCount: number;
    openCompanyFailureCount: number;
    overallCompanyScore: number;
    websiteAnalyticsScore: number;
    demoRequestCount: number;
    activeCustomerCount: number;
    revenueTotal: number;
    proposalPendingCount: number;
    supportOpenCount: number;
    platformHealthScore: number;
    auditCount: number;
}

export interface CmpPipelineInfo {
    stages: Array<{ key: string; label: string }>;
    currentStage: string;
    nextStage: string;
    previousStage: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    securityLevel: string;
    createdAt: string;
}

export interface CmpSdkConfigureBrandProfileInput { companyHubId: string; profileKey?: string; profileName?: string; }
export interface CmpSdkConfigureBrandProfileResult { profileId: string; profileKey: string; status: string; }
export interface CmpSdkPublishWebsitePageInput { companyHubId: string; pageKey?: string; pageTitle?: string; }
export interface CmpSdkPublishWebsitePageResult { pageId: string; pageKey: string; status: string; }
export interface CmpSdkGenerateProposalInput { companyHubId: string; proposalKey?: string; proposalName?: string; }
export interface CmpSdkGenerateProposalResult { proposalId: string; proposalKey: string; status: string; }

export interface CompanyHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateCompanyHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface BrandProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    brandStatus: string;
    status: string;
}

export interface CreateBrandProfileInput {
        companyHubId: string;
        profileKey?: string;
    profileName?: string;
    brandStatus?: string;
}

export interface LogoAssetSummary {
    id: string;
    hubName?: string;
        assetKey: string;
    assetName: string;
    assetType: string;
    status: string;
}

export interface CreateLogoAssetInput {
        companyHubId: string;
        assetKey?: string;
    assetName?: string;
    assetType?: string;
}

export interface ThemeConfigSummary {
    id: string;
    hubName?: string;
        configKey: string;
    configName: string;
    primaryColor: string;
    status: string;
}

export interface CreateThemeConfigInput {
        companyHubId: string;
        configKey?: string;
    configName?: string;
    primaryColor?: string;
}

export interface BrandAssetSummary {
    id: string;
    hubName?: string;
        assetKey: string;
    assetName: string;
    assetCategory: string;
    status: string;
}

export interface CreateBrandAssetInput {
        companyHubId: string;
        assetKey?: string;
    assetName?: string;
    assetCategory?: string;
}

export interface WebsitePageSummary {
    id: string;
    hubName?: string;
        pageKey: string;
    pageTitle: string;
    pageSlug: string;
    status: string;
}

export interface CreateWebsitePageInput {
        companyHubId: string;
        pageKey?: string;
    pageTitle?: string;
    pageSlug?: string;
}

export interface WebsiteFeatureSummary {
    id: string;
    hubName?: string;
        featureKey: string;
    featureName: string;
    featureType: string;
    status: string;
}

export interface CreateWebsiteFeatureInput {
        companyHubId: string;
        featureKey?: string;
    featureName?: string;
    featureType?: string;
}

export interface WebsiteSectionSummary {
    id: string;
    hubName?: string;
        sectionKey: string;
    sectionName: string;
    sectionType: string;
    status: string;
}

export interface CreateWebsiteSectionInput {
        companyHubId: string;
        sectionKey?: string;
    sectionName?: string;
    sectionType?: string;
}

export interface DemoRequestSummary {
    id: string;
    hubName?: string;
        requestKey: string;
    requestName: string;
    requestStatus: string;
    status: string;
}

export interface CreateDemoRequestInput {
        companyHubId: string;
        requestKey?: string;
    requestName?: string;
    requestStatus?: string;
}

export interface PricingPlanSummary {
    id: string;
    hubName?: string;
        planKey: string;
    planName: string;
    planTier: string;
    status: string;
}

export interface CreatePricingPlanInput {
        companyHubId: string;
        planKey?: string;
    planName?: string;
    planTier?: string;
}

export interface PricingPackageSummary {
    id: string;
    hubName?: string;
        packageKey: string;
    packageName: string;
    packageType: string;
    status: string;
}

export interface CreatePricingPackageInput {
        companyHubId: string;
        packageKey?: string;
    packageName?: string;
    packageType?: string;
}

export interface ModulePricingSummary {
    id: string;
    hubName?: string;
        pricingKey: string;
    moduleName: string;
    priceAmount: number;
    status: string;
}

export interface CreateModulePricingInput {
        companyHubId: string;
        pricingKey?: string;
    moduleName?: string;
    priceAmount?: number;
}

export interface DiscountRuleSummary {
    id: string;
    hubName?: string;
        ruleKey: string;
    ruleName: string;
    discountPercent: number;
    status: string;
}

export interface CreateDiscountRuleInput {
        companyHubId: string;
        ruleKey?: string;
    ruleName?: string;
    discountPercent?: number;
}

export interface ProposalSummary {
    id: string;
    hubName?: string;
        proposalKey: string;
    proposalName: string;
    proposalStatus: string;
    status: string;
}

export interface CreateProposalInput {
        companyHubId: string;
        proposalKey?: string;
    proposalName?: string;
    proposalStatus?: string;
}

export interface ProposalDocumentSummary {
    id: string;
    hubName?: string;
        documentKey: string;
    documentName: string;
    documentType: string;
    status: string;
}

export interface CreateProposalDocumentInput {
        companyHubId: string;
        documentKey?: string;
    documentName?: string;
    documentType?: string;
}

export interface ProposalContractSummary {
    id: string;
    hubName?: string;
        contractKey: string;
    contractName: string;
    contractStatus: string;
    status: string;
}

export interface CreateProposalContractInput {
        companyHubId: string;
        contractKey?: string;
    contractName?: string;
    contractStatus?: string;
}

export interface ProposalHistorySummary {
    id: string;
    hubName?: string;
        historyKey: string;
    historyType: string;
    changedAt: string;
    status: string;
}

export interface CreateProposalHistoryInput {
        companyHubId: string;
        historyKey?: string;
    historyType?: string;
    changedAt?: string;
}

export interface PortalDashboardSummary {
    id: string;
    hubName?: string;
        dashboardKey: string;
    dashboardName: string;
    dashboardType: string;
    status: string;
}

export interface CreatePortalDashboardInput {
        companyHubId: string;
        dashboardKey?: string;
    dashboardName?: string;
    dashboardType?: string;
}

export interface PortalSubscriptionSummary {
    id: string;
    hubName?: string;
        subscriptionKey: string;
    planName: string;
    subscriptionStatus: string;
    status: string;
}

export interface CreatePortalSubscriptionInput {
        companyHubId: string;
        subscriptionKey?: string;
    planName?: string;
    subscriptionStatus?: string;
}

export interface PortalBillingSummary {
    id: string;
    hubName?: string;
        billingKey: string;
    billingType: string;
    billingAmount: number;
    status: string;
}

export interface CreatePortalBillingInput {
        companyHubId: string;
        billingKey?: string;
    billingType?: string;
    billingAmount?: number;
}

export interface PortalSupportSummary {
    id: string;
    hubName?: string;
        supportKey: string;
    supportTitle: string;
    supportStatus: string;
    status: string;
}

export interface CreatePortalSupportInput {
        companyHubId: string;
        supportKey?: string;
    supportTitle?: string;
    supportStatus?: string;
}

export interface DocGuideSummary {
    id: string;
    hubName?: string;
        guideKey: string;
    guideTitle: string;
    guideCategory: string;
    status: string;
}

export interface CreateDocGuideInput {
        companyHubId: string;
        guideKey?: string;
    guideTitle?: string;
    guideCategory?: string;
}

export interface DocApiReferenceSummary {
    id: string;
    hubName?: string;
        referenceKey: string;
    referenceName: string;
    apiVersion: string;
    status: string;
}

export interface CreateDocApiReferenceInput {
        companyHubId: string;
        referenceKey?: string;
    referenceName?: string;
    apiVersion?: string;
}

export interface DocVersionSummary {
    id: string;
    hubName?: string;
        versionKey: string;
    versionName: string;
    versionNumber: string;
    status: string;
}

export interface CreateDocVersionInput {
        companyHubId: string;
        versionKey?: string;
    versionName?: string;
    versionNumber?: string;
}

export interface DemoOrganizationSummary {
    id: string;
    hubName?: string;
        orgKey: string;
    orgName: string;
    orgType: string;
    status: string;
}

export interface CreateDemoOrganizationInput {
        companyHubId: string;
        orgKey?: string;
    orgName?: string;
    orgType?: string;
}

export interface DemoDataSetSummary {
    id: string;
    hubName?: string;
        datasetKey: string;
    datasetName: string;
    recordCount: number;
    status: string;
}

export interface CreateDemoDataSetInput {
        companyHubId: string;
        datasetKey?: string;
    datasetName?: string;
    recordCount?: number;
}

export interface DemoUserSummary {
    id: string;
    hubName?: string;
        userKey: string;
    userName: string;
    userRole: string;
    status: string;
}

export interface CreateDemoUserInput {
        companyHubId: string;
        userKey?: string;
    userName?: string;
    userRole?: string;
}

export interface CompanyMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    overallCompanyScore: number;
    platformHealthScore: number;
    status: string;
}

export interface CreateCompanyMetricInput {
        metricsKey?: string;
    overallCompanyScore?: number;
    platformHealthScore?: number;
}

export interface CompanyHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateCompanyHealthInput {
        healthKey?: string;
    overallScore?: number;
    disasterRecoveryMode?: boolean;
}

export interface ExecutiveKpiSummary {
    id: string;
    hubName?: string;
        kpiKey: string;
    kpiName: string;
    kpiScore: number;
    status: string;
}

export interface CreateExecutiveKpiInput {
        companyHubId: string;
        kpiKey?: string;
    kpiName?: string;
    kpiScore?: number;
}

export interface CompanyFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateCompanyFailureInput {
        companyHubId: string;
        failureKey?: string;
    failureType?: string;
}

