#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("CmpCompanyHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/launch-foundation-repositories\";";
    const elfImportEnd = da.indexOf(anchor) + anchor.length;
    const cmpImport = `
import {
    CmpCompanyHubRepository,
    CmpBrandProfileRepository,
    CmpLogoAssetRepository,
    CmpThemeConfigRepository,
    CmpBrandAssetRepository,
    CmpWebsitePageRepository,
    CmpWebsiteFeatureRepository,
    CmpWebsiteSectionRepository,
    CmpDemoRequestRepository,
    CmpPricingPlanRepository,
    CmpPricingPackageRepository,
    CmpModulePricingRepository,
    CmpDiscountRuleRepository,
    CmpProposalRepository,
    CmpProposalDocumentRepository,
    CmpProposalContractRepository,
    CmpProposalHistoryRepository,
    CmpPortalDashboardRepository,
    CmpPortalSubscriptionRepository,
    CmpPortalBillingRepository,
    CmpPortalSupportRepository,
    CmpDocGuideRepository,
    CmpDocApiReferenceRepository,
    CmpDocVersionRepository,
    CmpDemoOrganizationRepository,
    CmpDemoDataSetRepository,
    CmpDemoUserRepository,
    CmpCompanyMetricRepository,
    CmpCompanyHealthRepository,
    CmpExecutiveKpiRepository,
    CmpCompanyFailureRepository,
    CmpAuditLogRepository,
} from "@/src/modules/database/repositories/company-foundation-repositories";
`;
    da = da.slice(0, elfImportEnd) + cmpImport + da.slice(elfImportEnd);

    const elfProp = "    readonly elfAuditLogs: ElfAuditLogRepository;";
    const cmpProps = `    readonly cmpCompanyHubs: CmpCompanyHubRepository;
    readonly cmpBrandProfiles: CmpBrandProfileRepository;
    readonly cmpLogoAssets: CmpLogoAssetRepository;
    readonly cmpThemeConfigs: CmpThemeConfigRepository;
    readonly cmpBrandAssets: CmpBrandAssetRepository;
    readonly cmpWebsitePages: CmpWebsitePageRepository;
    readonly cmpWebsiteFeatures: CmpWebsiteFeatureRepository;
    readonly cmpWebsiteSections: CmpWebsiteSectionRepository;
    readonly cmpDemoRequests: CmpDemoRequestRepository;
    readonly cmpPricingPlans: CmpPricingPlanRepository;
    readonly cmpPricingPackages: CmpPricingPackageRepository;
    readonly cmpModulePricing: CmpModulePricingRepository;
    readonly cmpDiscountRules: CmpDiscountRuleRepository;
    readonly cmpProposals: CmpProposalRepository;
    readonly cmpProposalDocuments: CmpProposalDocumentRepository;
    readonly cmpProposalContracts: CmpProposalContractRepository;
    readonly cmpProposalHistory: CmpProposalHistoryRepository;
    readonly cmpPortalDashboards: CmpPortalDashboardRepository;
    readonly cmpPortalSubscriptions: CmpPortalSubscriptionRepository;
    readonly cmpPortalBilling: CmpPortalBillingRepository;
    readonly cmpPortalSupport: CmpPortalSupportRepository;
    readonly cmpDocGuides: CmpDocGuideRepository;
    readonly cmpDocApiReferences: CmpDocApiReferenceRepository;
    readonly cmpDocVersions: CmpDocVersionRepository;
    readonly cmpDemoOrganizations: CmpDemoOrganizationRepository;
    readonly cmpDemoDataSets: CmpDemoDataSetRepository;
    readonly cmpDemoUsers: CmpDemoUserRepository;
    readonly cmpCompanyMetrics: CmpCompanyMetricRepository;
    readonly cmpCompanyHealth: CmpCompanyHealthRepository;
    readonly cmpExecutiveKpis: CmpExecutiveKpiRepository;
    readonly cmpCompanyFailures: CmpCompanyFailureRepository;
    readonly cmpAuditLogs: CmpAuditLogRepository;`;
    da = da.replace(elfProp, elfProp + "\n" + cmpProps);

    const elfCtor = "        this.elfAuditLogs = new ElfAuditLogRepository();";
    const cmpCtor = `        this.cmpCompanyHubs = new CmpCompanyHubRepository();
        this.cmpBrandProfiles = new CmpBrandProfileRepository();
        this.cmpLogoAssets = new CmpLogoAssetRepository();
        this.cmpThemeConfigs = new CmpThemeConfigRepository();
        this.cmpBrandAssets = new CmpBrandAssetRepository();
        this.cmpWebsitePages = new CmpWebsitePageRepository();
        this.cmpWebsiteFeatures = new CmpWebsiteFeatureRepository();
        this.cmpWebsiteSections = new CmpWebsiteSectionRepository();
        this.cmpDemoRequests = new CmpDemoRequestRepository();
        this.cmpPricingPlans = new CmpPricingPlanRepository();
        this.cmpPricingPackages = new CmpPricingPackageRepository();
        this.cmpModulePricing = new CmpModulePricingRepository();
        this.cmpDiscountRules = new CmpDiscountRuleRepository();
        this.cmpProposals = new CmpProposalRepository();
        this.cmpProposalDocuments = new CmpProposalDocumentRepository();
        this.cmpProposalContracts = new CmpProposalContractRepository();
        this.cmpProposalHistory = new CmpProposalHistoryRepository();
        this.cmpPortalDashboards = new CmpPortalDashboardRepository();
        this.cmpPortalSubscriptions = new CmpPortalSubscriptionRepository();
        this.cmpPortalBilling = new CmpPortalBillingRepository();
        this.cmpPortalSupport = new CmpPortalSupportRepository();
        this.cmpDocGuides = new CmpDocGuideRepository();
        this.cmpDocApiReferences = new CmpDocApiReferenceRepository();
        this.cmpDocVersions = new CmpDocVersionRepository();
        this.cmpDemoOrganizations = new CmpDemoOrganizationRepository();
        this.cmpDemoDataSets = new CmpDemoDataSetRepository();
        this.cmpDemoUsers = new CmpDemoUserRepository();
        this.cmpCompanyMetrics = new CmpCompanyMetricRepository();
        this.cmpCompanyHealth = new CmpCompanyHealthRepository();
        this.cmpExecutiveKpis = new CmpExecutiveKpiRepository();
        this.cmpCompanyFailures = new CmpCompanyFailureRepository();
        this.cmpAuditLogs = new CmpAuditLogRepository();`;
    da = da.replace(elfCtor, elfCtor + "\n" + cmpCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("cmpCompanyHubs")) {
    ds = ds.replace(
        "    elfAuditLogs: databaseAccess.elfAuditLogs,",
        `    elfAuditLogs: databaseAccess.elfAuditLogs,
    cmpCompanyHubs: databaseAccess.cmpCompanyHubs,
    cmpBrandProfiles: databaseAccess.cmpBrandProfiles,
    cmpLogoAssets: databaseAccess.cmpLogoAssets,
    cmpThemeConfigs: databaseAccess.cmpThemeConfigs,
    cmpBrandAssets: databaseAccess.cmpBrandAssets,
    cmpWebsitePages: databaseAccess.cmpWebsitePages,
    cmpWebsiteFeatures: databaseAccess.cmpWebsiteFeatures,
    cmpWebsiteSections: databaseAccess.cmpWebsiteSections,
    cmpDemoRequests: databaseAccess.cmpDemoRequests,
    cmpPricingPlans: databaseAccess.cmpPricingPlans,
    cmpPricingPackages: databaseAccess.cmpPricingPackages,
    cmpModulePricing: databaseAccess.cmpModulePricing,
    cmpDiscountRules: databaseAccess.cmpDiscountRules,
    cmpProposals: databaseAccess.cmpProposals,
    cmpProposalDocuments: databaseAccess.cmpProposalDocuments,
    cmpProposalContracts: databaseAccess.cmpProposalContracts,
    cmpProposalHistory: databaseAccess.cmpProposalHistory,
    cmpPortalDashboards: databaseAccess.cmpPortalDashboards,
    cmpPortalSubscriptions: databaseAccess.cmpPortalSubscriptions,
    cmpPortalBilling: databaseAccess.cmpPortalBilling,
    cmpPortalSupport: databaseAccess.cmpPortalSupport,
    cmpDocGuides: databaseAccess.cmpDocGuides,
    cmpDocApiReferences: databaseAccess.cmpDocApiReferences,
    cmpDocVersions: databaseAccess.cmpDocVersions,
    cmpDemoOrganizations: databaseAccess.cmpDemoOrganizations,
    cmpDemoDataSets: databaseAccess.cmpDemoDataSets,
    cmpDemoUsers: databaseAccess.cmpDemoUsers,
    cmpCompanyMetrics: databaseAccess.cmpCompanyMetrics,
    cmpCompanyHealth: databaseAccess.cmpCompanyHealth,
    cmpExecutiveKpis: databaseAccess.cmpExecutiveKpis,
    cmpCompanyFailures: databaseAccess.cmpCompanyFailures,
    cmpAuditLogs: databaseAccess.cmpAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for CMP");
