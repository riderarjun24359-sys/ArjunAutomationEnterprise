import {
    buildCompanyHubLookupMaps,
    buildCmpAuditPayload,
    buildCmpDashboardStats,
    buildCmpPipelineInfo,
    mapAuditEntry,
    buildCompanyHubPayload,
    mapCompanyHubSummary,
    buildBrandProfilePayload,
    mapBrandProfileSummary,
    buildLogoAssetPayload,
    mapLogoAssetSummary,
    buildThemeConfigPayload,
    mapThemeConfigSummary,
    buildBrandAssetPayload,
    mapBrandAssetSummary,
    buildWebsitePagePayload,
    mapWebsitePageSummary,
    buildWebsiteFeaturePayload,
    mapWebsiteFeatureSummary,
    buildWebsiteSectionPayload,
    mapWebsiteSectionSummary,
    buildDemoRequestPayload,
    mapDemoRequestSummary,
    buildPricingPlanPayload,
    mapPricingPlanSummary,
    buildPricingPackagePayload,
    mapPricingPackageSummary,
    buildModulePricingPayload,
    mapModulePricingSummary,
    buildDiscountRulePayload,
    mapDiscountRuleSummary,
    buildProposalPayload,
    mapProposalSummary,
    buildProposalDocumentPayload,
    mapProposalDocumentSummary,
    buildProposalContractPayload,
    mapProposalContractSummary,
    buildProposalHistoryPayload,
    mapProposalHistorySummary,
    buildPortalDashboardPayload,
    mapPortalDashboardSummary,
    buildPortalSubscriptionPayload,
    mapPortalSubscriptionSummary,
    buildPortalBillingPayload,
    mapPortalBillingSummary,
    buildPortalSupportPayload,
    mapPortalSupportSummary,
    buildDocGuidePayload,
    mapDocGuideSummary,
    buildDocApiReferencePayload,
    mapDocApiReferenceSummary,
    buildDocVersionPayload,
    mapDocVersionSummary,
    buildDemoOrganizationPayload,
    mapDemoOrganizationSummary,
    buildDemoDataSetPayload,
    mapDemoDataSetSummary,
    buildDemoUserPayload,
    mapDemoUserSummary,
    buildCompanyMetricPayload,
    mapCompanyMetricSummary,
    buildCompanyHealthPayload,
    mapCompanyHealthSummary,
    buildExecutiveKpiPayload,
    mapExecutiveKpiSummary,
    buildCompanyFailurePayload,
    mapCompanyFailureSummary,
    mapBrandProfileForStats,
    mapPortalDashboardForStats,
    mapCompanyMetricForStats,
    mapWebsitePageForStats,
    mapPricingPlanForStats,
    mapProposalForStats,
    mapCompanyHealthForStats,
    mapCompanyFailureForStats,
} from "@/src/modules/database/lib/company-foundation-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createIndustryFrameworkClient } from "@/src/modules/industry-framework/sdk";
import { createBusinessProcessClient } from "@/src/modules/business-process/sdk";
import { createFormEngineClient } from "@/src/modules/form-engine/sdk";
import { createWorkflowEngineClient } from "@/src/modules/workflow-engine/sdk";
import { createDocumentEngineClient } from "@/src/modules/document-engine/sdk";
import { createCommercialSaasClient } from "@/src/modules/commercial-saas/sdk";
import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";
import { createCommunicationHubClient } from "@/src/modules/communication-hub/sdk";
import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";
import { createLaunchFoundationClient } from "@/src/modules/launch-foundation/sdk";
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
    CmpSdkConfigureBrandProfileInput,
    CmpSdkConfigureBrandProfileResult,
    CmpSdkPublishWebsitePageInput,
    CmpSdkPublishWebsitePageResult,
    CmpSdkGenerateProposalInput,
    CmpSdkGenerateProposalResult,
} from "@/src/modules/company-foundation/types";

export class CompanyFoundationService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const companyHubs = await databaseService.cmpCompanyHubs.listByOrganization(organizationId);
        return buildCompanyHubLookupMaps(companyHubs);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CmpDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildCmpDashboardStats({ companyHubs: [], brandProfiles: [], companyMetrics: [], websitePages: [], pricingPlans: [], proposals: [], portalDashboards: [], companyHealth: [], companyFailures: [], auditLogs: [] });
        const [companyHubs, brandProfilesRaw, companyMetricsRaw, websitePagesRaw, pricingPlansRaw, proposalsRaw, portalDashboardsRaw, companyHealthRaw, companyFailures, auditLogs] = await Promise.all([
            this.getCompanyHubs(authUserId, email, fullName),
            databaseService.cmpBrandProfiles.listByOrganization(context.organizationId),
            databaseService.cmpCompanyMetrics.listByOrganization(context.organizationId),
            databaseService.cmpWebsitePages.listByOrganization(context.organizationId),
            databaseService.cmpPricingPlans.listByOrganization(context.organizationId),
            databaseService.cmpProposals.listByOrganization(context.organizationId),
            databaseService.cmpPortalDashboards.listByOrganization(context.organizationId),
            databaseService.cmpCompanyHealth.listByOrganization(context.organizationId),
            this.getCompanyFailures(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildCmpDashboardStats({
            companyHubs,
            brandProfiles: brandProfilesRaw.map(mapBrandProfileForStats),
            companyMetrics: companyMetricsRaw.map(mapCompanyMetricForStats),
            websitePages: websitePagesRaw.map(mapWebsitePageForStats),
            pricingPlans: pricingPlansRaw.map(mapPricingPlanForStats),
            proposals: proposalsRaw.map(mapProposalForStats),
            portalDashboards: portalDashboardsRaw.map(mapPortalDashboardForStats),
            companyHealth: companyHealthRaw.map(mapCompanyHealthForStats),
            companyFailures,
            auditLogs,
        });
    }

    getPipelineInfo(): CmpPipelineInfo {
        return buildCmpPipelineInfo();
    }

    async getCompanyHubs(authUserId: string, email: string, fullName?: string | null): Promise<CompanyHubSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cmpCompanyHubs.listByOrganization(context.organizationId)).map((r) => mapCompanyHubSummary(r));
    }

    async createCompanyHub(authUserId: string, email: string, input: CreateCompanyHubInput, fullName?: string | null): Promise<CompanyHubSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpCompanyHubs.create(buildCompanyHubPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create companyHubs");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "company_hubs", "create", `CompanyHub created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCompanyHubSummary(created);
    }

    async getBrandProfiles(authUserId: string, email: string, fullName?: string | null): Promise<BrandProfileSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpBrandProfiles.listByOrganization(context.organizationId)).map((r) => mapBrandProfileSummary(r, maps));
    }

    async createBrandProfile(authUserId: string, email: string, input: CreateBrandProfileInput, fullName?: string | null): Promise<BrandProfileSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpBrandProfiles.create(buildBrandProfilePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create brandProfiles");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "brand_profiles", "create", `BrandProfile created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrandProfileSummary(created, maps);
    }

    async getLogoAssets(authUserId: string, email: string, fullName?: string | null): Promise<LogoAssetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpLogoAssets.listByOrganization(context.organizationId)).map((r) => mapLogoAssetSummary(r, maps));
    }

    async createLogoAsset(authUserId: string, email: string, input: CreateLogoAssetInput, fullName?: string | null): Promise<LogoAssetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpLogoAssets.create(buildLogoAssetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create logoAssets");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "logo_assets", "create", `LogoAsset created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapLogoAssetSummary(created, maps);
    }

    async getThemeConfigs(authUserId: string, email: string, fullName?: string | null): Promise<ThemeConfigSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpThemeConfigs.listByOrganization(context.organizationId)).map((r) => mapThemeConfigSummary(r, maps));
    }

    async createThemeConfig(authUserId: string, email: string, input: CreateThemeConfigInput, fullName?: string | null): Promise<ThemeConfigSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpThemeConfigs.create(buildThemeConfigPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create themeConfigs");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "theme_configs", "create", `ThemeConfig created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapThemeConfigSummary(created, maps);
    }

    async getBrandAssets(authUserId: string, email: string, fullName?: string | null): Promise<BrandAssetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpBrandAssets.listByOrganization(context.organizationId)).map((r) => mapBrandAssetSummary(r, maps));
    }

    async createBrandAsset(authUserId: string, email: string, input: CreateBrandAssetInput, fullName?: string | null): Promise<BrandAssetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpBrandAssets.create(buildBrandAssetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create brandAssets");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "brand_assets", "create", `BrandAsset created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapBrandAssetSummary(created, maps);
    }

    async getWebsitePages(authUserId: string, email: string, fullName?: string | null): Promise<WebsitePageSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpWebsitePages.listByOrganization(context.organizationId)).map((r) => mapWebsitePageSummary(r, maps));
    }

    async createWebsitePage(authUserId: string, email: string, input: CreateWebsitePageInput, fullName?: string | null): Promise<WebsitePageSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpWebsitePages.create(buildWebsitePagePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create websitePages");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "website_pages", "create", `WebsitePage created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWebsitePageSummary(created, maps);
    }

    async getWebsiteFeatures(authUserId: string, email: string, fullName?: string | null): Promise<WebsiteFeatureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpWebsiteFeatures.listByOrganization(context.organizationId)).map((r) => mapWebsiteFeatureSummary(r, maps));
    }

    async createWebsiteFeature(authUserId: string, email: string, input: CreateWebsiteFeatureInput, fullName?: string | null): Promise<WebsiteFeatureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpWebsiteFeatures.create(buildWebsiteFeaturePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create websiteFeatures");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "website_features", "create", `WebsiteFeature created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWebsiteFeatureSummary(created, maps);
    }

    async getWebsiteSections(authUserId: string, email: string, fullName?: string | null): Promise<WebsiteSectionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpWebsiteSections.listByOrganization(context.organizationId)).map((r) => mapWebsiteSectionSummary(r, maps));
    }

    async createWebsiteSection(authUserId: string, email: string, input: CreateWebsiteSectionInput, fullName?: string | null): Promise<WebsiteSectionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpWebsiteSections.create(buildWebsiteSectionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create websiteSections");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "website_sections", "create", `WebsiteSection created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapWebsiteSectionSummary(created, maps);
    }

    async getDemoRequests(authUserId: string, email: string, fullName?: string | null): Promise<DemoRequestSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpDemoRequests.listByOrganization(context.organizationId)).map((r) => mapDemoRequestSummary(r, maps));
    }

    async createDemoRequest(authUserId: string, email: string, input: CreateDemoRequestInput, fullName?: string | null): Promise<DemoRequestSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpDemoRequests.create(buildDemoRequestPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create demoRequests");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "demo_requests", "create", `DemoRequest created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDemoRequestSummary(created, maps);
    }

    async getPricingPlans(authUserId: string, email: string, fullName?: string | null): Promise<PricingPlanSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpPricingPlans.listByOrganization(context.organizationId)).map((r) => mapPricingPlanSummary(r, maps));
    }

    async createPricingPlan(authUserId: string, email: string, input: CreatePricingPlanInput, fullName?: string | null): Promise<PricingPlanSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpPricingPlans.create(buildPricingPlanPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pricingPlans");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "pricing_plans", "create", `PricingPlan created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPricingPlanSummary(created, maps);
    }

    async getPricingPackages(authUserId: string, email: string, fullName?: string | null): Promise<PricingPackageSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpPricingPackages.listByOrganization(context.organizationId)).map((r) => mapPricingPackageSummary(r, maps));
    }

    async createPricingPackage(authUserId: string, email: string, input: CreatePricingPackageInput, fullName?: string | null): Promise<PricingPackageSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpPricingPackages.create(buildPricingPackagePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pricingPackages");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "pricing_packages", "create", `PricingPackage created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPricingPackageSummary(created, maps);
    }

    async getModulePricings(authUserId: string, email: string, fullName?: string | null): Promise<ModulePricingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpModulePricing.listByOrganization(context.organizationId)).map((r) => mapModulePricingSummary(r, maps));
    }

    async createModulePricing(authUserId: string, email: string, input: CreateModulePricingInput, fullName?: string | null): Promise<ModulePricingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpModulePricing.create(buildModulePricingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create modulePricing");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "module_pricing", "create", `ModulePricing created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapModulePricingSummary(created, maps);
    }

    async getDiscountRules(authUserId: string, email: string, fullName?: string | null): Promise<DiscountRuleSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpDiscountRules.listByOrganization(context.organizationId)).map((r) => mapDiscountRuleSummary(r, maps));
    }

    async createDiscountRule(authUserId: string, email: string, input: CreateDiscountRuleInput, fullName?: string | null): Promise<DiscountRuleSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpDiscountRules.create(buildDiscountRulePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create discountRules");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "discount_rules", "create", `DiscountRule created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDiscountRuleSummary(created, maps);
    }

    async getProposals(authUserId: string, email: string, fullName?: string | null): Promise<ProposalSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpProposals.listByOrganization(context.organizationId)).map((r) => mapProposalSummary(r, maps));
    }

    async createProposal(authUserId: string, email: string, input: CreateProposalInput, fullName?: string | null): Promise<ProposalSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpProposals.create(buildProposalPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create proposals");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "proposals", "create", `Proposal created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProposalSummary(created, maps);
    }

    async getProposalDocuments(authUserId: string, email: string, fullName?: string | null): Promise<ProposalDocumentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpProposalDocuments.listByOrganization(context.organizationId)).map((r) => mapProposalDocumentSummary(r, maps));
    }

    async createProposalDocument(authUserId: string, email: string, input: CreateProposalDocumentInput, fullName?: string | null): Promise<ProposalDocumentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpProposalDocuments.create(buildProposalDocumentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create proposalDocuments");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "proposal_documents", "create", `ProposalDocument created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProposalDocumentSummary(created, maps);
    }

    async getProposalContracts(authUserId: string, email: string, fullName?: string | null): Promise<ProposalContractSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpProposalContracts.listByOrganization(context.organizationId)).map((r) => mapProposalContractSummary(r, maps));
    }

    async createProposalContract(authUserId: string, email: string, input: CreateProposalContractInput, fullName?: string | null): Promise<ProposalContractSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpProposalContracts.create(buildProposalContractPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create proposalContracts");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "proposal_contracts", "create", `ProposalContract created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProposalContractSummary(created, maps);
    }

    async getProposalHistorys(authUserId: string, email: string, fullName?: string | null): Promise<ProposalHistorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpProposalHistory.listByOrganization(context.organizationId)).map((r) => mapProposalHistorySummary(r, maps));
    }

    async createProposalHistory(authUserId: string, email: string, input: CreateProposalHistoryInput, fullName?: string | null): Promise<ProposalHistorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpProposalHistory.create(buildProposalHistoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create proposalHistory");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "proposal_history", "create", `ProposalHistory created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProposalHistorySummary(created, maps);
    }

    async getPortalDashboards(authUserId: string, email: string, fullName?: string | null): Promise<PortalDashboardSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpPortalDashboards.listByOrganization(context.organizationId)).map((r) => mapPortalDashboardSummary(r, maps));
    }

    async createPortalDashboard(authUserId: string, email: string, input: CreatePortalDashboardInput, fullName?: string | null): Promise<PortalDashboardSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpPortalDashboards.create(buildPortalDashboardPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create portalDashboards");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "portal_dashboards", "create", `PortalDashboard created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalDashboardSummary(created, maps);
    }

    async getPortalSubscriptions(authUserId: string, email: string, fullName?: string | null): Promise<PortalSubscriptionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpPortalSubscriptions.listByOrganization(context.organizationId)).map((r) => mapPortalSubscriptionSummary(r, maps));
    }

    async createPortalSubscription(authUserId: string, email: string, input: CreatePortalSubscriptionInput, fullName?: string | null): Promise<PortalSubscriptionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpPortalSubscriptions.create(buildPortalSubscriptionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create portalSubscriptions");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "portal_subscriptions", "create", `PortalSubscription created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalSubscriptionSummary(created, maps);
    }

    async getPortalBillings(authUserId: string, email: string, fullName?: string | null): Promise<PortalBillingSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpPortalBilling.listByOrganization(context.organizationId)).map((r) => mapPortalBillingSummary(r, maps));
    }

    async createPortalBilling(authUserId: string, email: string, input: CreatePortalBillingInput, fullName?: string | null): Promise<PortalBillingSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpPortalBilling.create(buildPortalBillingPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create portalBilling");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "portal_billing", "create", `PortalBilling created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalBillingSummary(created, maps);
    }

    async getPortalSupports(authUserId: string, email: string, fullName?: string | null): Promise<PortalSupportSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpPortalSupport.listByOrganization(context.organizationId)).map((r) => mapPortalSupportSummary(r, maps));
    }

    async createPortalSupport(authUserId: string, email: string, input: CreatePortalSupportInput, fullName?: string | null): Promise<PortalSupportSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpPortalSupport.create(buildPortalSupportPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create portalSupport");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "portal_support", "create", `PortalSupport created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapPortalSupportSummary(created, maps);
    }

    async getDocGuides(authUserId: string, email: string, fullName?: string | null): Promise<DocGuideSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpDocGuides.listByOrganization(context.organizationId)).map((r) => mapDocGuideSummary(r, maps));
    }

    async createDocGuide(authUserId: string, email: string, input: CreateDocGuideInput, fullName?: string | null): Promise<DocGuideSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpDocGuides.create(buildDocGuidePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create docGuides");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "doc_guides", "create", `DocGuide created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDocGuideSummary(created, maps);
    }

    async getDocApiReferences(authUserId: string, email: string, fullName?: string | null): Promise<DocApiReferenceSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpDocApiReferences.listByOrganization(context.organizationId)).map((r) => mapDocApiReferenceSummary(r, maps));
    }

    async createDocApiReference(authUserId: string, email: string, input: CreateDocApiReferenceInput, fullName?: string | null): Promise<DocApiReferenceSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpDocApiReferences.create(buildDocApiReferencePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create docApiReferences");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "doc_api_references", "create", `DocApiReference created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDocApiReferenceSummary(created, maps);
    }

    async getDocVersions(authUserId: string, email: string, fullName?: string | null): Promise<DocVersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpDocVersions.listByOrganization(context.organizationId)).map((r) => mapDocVersionSummary(r, maps));
    }

    async createDocVersion(authUserId: string, email: string, input: CreateDocVersionInput, fullName?: string | null): Promise<DocVersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpDocVersions.create(buildDocVersionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create docVersions");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "doc_versions", "create", `DocVersion created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDocVersionSummary(created, maps);
    }

    async getDemoOrganizations(authUserId: string, email: string, fullName?: string | null): Promise<DemoOrganizationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpDemoOrganizations.listByOrganization(context.organizationId)).map((r) => mapDemoOrganizationSummary(r, maps));
    }

    async createDemoOrganization(authUserId: string, email: string, input: CreateDemoOrganizationInput, fullName?: string | null): Promise<DemoOrganizationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpDemoOrganizations.create(buildDemoOrganizationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create demoOrganizations");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "demo_organizations", "create", `DemoOrganization created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDemoOrganizationSummary(created, maps);
    }

    async getDemoDataSets(authUserId: string, email: string, fullName?: string | null): Promise<DemoDataSetSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpDemoDataSets.listByOrganization(context.organizationId)).map((r) => mapDemoDataSetSummary(r, maps));
    }

    async createDemoDataSet(authUserId: string, email: string, input: CreateDemoDataSetInput, fullName?: string | null): Promise<DemoDataSetSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpDemoDataSets.create(buildDemoDataSetPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create demoDataSets");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "demo_data_sets", "create", `DemoDataSet created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDemoDataSetSummary(created, maps);
    }

    async getDemoUsers(authUserId: string, email: string, fullName?: string | null): Promise<DemoUserSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpDemoUsers.listByOrganization(context.organizationId)).map((r) => mapDemoUserSummary(r, maps));
    }

    async createDemoUser(authUserId: string, email: string, input: CreateDemoUserInput, fullName?: string | null): Promise<DemoUserSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpDemoUsers.create(buildDemoUserPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create demoUsers");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "demo_users", "create", `DemoUser created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapDemoUserSummary(created, maps);
    }

    async getCompanyMetrics(authUserId: string, email: string, fullName?: string | null): Promise<CompanyMetricSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cmpCompanyMetrics.listByOrganization(context.organizationId)).map(mapCompanyMetricSummary);
    }

    async createCompanyMetric(authUserId: string, email: string, input: CreateCompanyMetricInput, fullName?: string | null): Promise<CompanyMetricSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpCompanyMetrics.create(buildCompanyMetricPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create companyMetrics");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "company_metrics", "create", `CompanyMetric created`, created.id));
        return mapCompanyMetricSummary(created);
    }

    async getCompanyHealths(authUserId: string, email: string, fullName?: string | null): Promise<CompanyHealthSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cmpCompanyHealth.listByOrganization(context.organizationId)).map(mapCompanyHealthSummary);
    }

    async createCompanyHealth(authUserId: string, email: string, input: CreateCompanyHealthInput, fullName?: string | null): Promise<CompanyHealthSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpCompanyHealth.create(buildCompanyHealthPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create companyHealth");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "company_health", "create", `CompanyHealth created`, created.id));
        return mapCompanyHealthSummary(created);
    }

    async getExecutiveKpis(authUserId: string, email: string, fullName?: string | null): Promise<ExecutiveKpiSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpExecutiveKpis.listByOrganization(context.organizationId)).map((r) => mapExecutiveKpiSummary(r, maps));
    }

    async createExecutiveKpi(authUserId: string, email: string, input: CreateExecutiveKpiInput, fullName?: string | null): Promise<ExecutiveKpiSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpExecutiveKpis.create(buildExecutiveKpiPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create executiveKpis");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "executive_kpis", "create", `ExecutiveKpi created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapExecutiveKpiSummary(created, maps);
    }

    async getCompanyFailures(authUserId: string, email: string, fullName?: string | null): Promise<CompanyFailureSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.cmpCompanyFailures.listByOrganization(context.organizationId)).map((r) => mapCompanyFailureSummary(r, maps));
    }

    async createCompanyFailure(authUserId: string, email: string, input: CreateCompanyFailureInput, fullName?: string | null): Promise<CompanyFailureSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.cmpCompanyFailures.create(buildCompanyFailurePayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create companyFailures");
        await databaseService.cmpAuditLogs.create(buildCmpAuditPayload(context.organizationId, "company_failures", "create", `CompanyFailure created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCompanyFailureSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cmpAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getCompanyHubOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.cmpCompanyHubs.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.hub_name }));
    }

    async sdkConfigureBrandProfile(authUserId: string, email: string, input: CmpSdkConfigureBrandProfileInput, fullName?: string | null): Promise<CmpSdkConfigureBrandProfileResult> {
        const ifr = createIndustryFrameworkClient(authUserId, email, fullName);
        await ifr.getFrameworkHubs();
        const dfe = createFormEngineClient(authUserId, email, fullName);
        await dfe.getFormHubs();
        const created = await this.createBrandProfile(authUserId, email, { companyHubId: input.companyHubId, profileKey: input.profileKey, profileName: input.profileName }, fullName);
        return { profileId: created.id, profileKey: created.profileKey, status: created.status };
    }

    async sdkPublishWebsitePage(authUserId: string, email: string, input: CmpSdkPublishWebsitePageInput, fullName?: string | null): Promise<CmpSdkPublishWebsitePageResult> {
        const dwe = createWorkflowEngineClient(authUserId, email, fullName);
        await dwe.getWorkflowHubs();
        const dde = createDocumentEngineClient(authUserId, email, fullName);
        await dde.getDocumentHubs();
        const created = await this.createWebsitePage(authUserId, email, { companyHubId: input.companyHubId, pageKey: input.pageKey, pageTitle: input.pageTitle }, fullName);
        return { pageId: created.id, pageKey: created.pageKey, status: created.status };
    }

    async sdkGenerateProposal(authUserId: string, email: string, input: CmpSdkGenerateProposalInput, fullName?: string | null): Promise<CmpSdkGenerateProposalResult> {
        const bpf = createBusinessProcessClient(authUserId, email, fullName);
        await bpf.getProcessHubs();
        const saas = createCommercialSaasClient(authUserId, email, fullName);
        await saas.getTenants();
        const identity = createEnterpriseIdentityClient(authUserId, email, fullName);
        await identity.getRealms();
        const comm = createCommunicationHubClient(authUserId, email, fullName);
        await comm.getCommunicationHubs();
        const intg = createIntegrationPlatformClient(authUserId, email, fullName);
        await intg.getIntegrationHubs();
        const elf = createLaunchFoundationClient(authUserId, email, fullName);
        await elf.getLaunchHubs();
        const created = await this.createProposal(authUserId, email, { companyHubId: input.companyHubId, proposalKey: input.proposalKey, proposalName: input.proposalName }, fullName);
        return { proposalId: created.id, proposalKey: created.proposalKey, status: created.status };
    }
}

export const companyFoundationService = new CompanyFoundationService();
