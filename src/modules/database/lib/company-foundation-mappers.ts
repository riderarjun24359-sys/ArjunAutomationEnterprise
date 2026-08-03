import type { DbCmpCompanyHub,
    DbCmpBrandProfile,
    DbCmpLogoAsset,
    DbCmpThemeConfig,
    DbCmpBrandAsset,
    DbCmpWebsitePage,
    DbCmpWebsiteFeature,
    DbCmpWebsiteSection,
    DbCmpDemoRequest,
    DbCmpPricingPlan,
    DbCmpPricingPackage,
    DbCmpModulePricing,
    DbCmpDiscountRule,
    DbCmpProposal,
    DbCmpProposalDocument,
    DbCmpProposalContract,
    DbCmpProposalHistory,
    DbCmpPortalDashboard,
    DbCmpPortalSubscription,
    DbCmpPortalBilling,
    DbCmpPortalSupport,
    DbCmpDocGuide,
    DbCmpDocApiReference,
    DbCmpDocVersion,
    DbCmpDemoOrganization,
    DbCmpDemoDataSet,
    DbCmpDemoUser,
    DbCmpCompanyMetric,
    DbCmpCompanyHealth,
    DbCmpExecutiveKpi,
    DbCmpCompanyFailure,
    DbCmpAuditLog } from "@/src/modules/database/types/platform";
import type { CreateCompanyHubInput,
    CompanyHubSummary,
    CreateBrandProfileInput,
    BrandProfileSummary,
    CreateLogoAssetInput,
    LogoAssetSummary,
    CreateThemeConfigInput,
    ThemeConfigSummary,
    CreateBrandAssetInput,
    BrandAssetSummary,
    CreateWebsitePageInput,
    WebsitePageSummary,
    CreateWebsiteFeatureInput,
    WebsiteFeatureSummary,
    CreateWebsiteSectionInput,
    WebsiteSectionSummary,
    CreateDemoRequestInput,
    DemoRequestSummary,
    CreatePricingPlanInput,
    PricingPlanSummary,
    CreatePricingPackageInput,
    PricingPackageSummary,
    CreateModulePricingInput,
    ModulePricingSummary,
    CreateDiscountRuleInput,
    DiscountRuleSummary,
    CreateProposalInput,
    ProposalSummary,
    CreateProposalDocumentInput,
    ProposalDocumentSummary,
    CreateProposalContractInput,
    ProposalContractSummary,
    CreateProposalHistoryInput,
    ProposalHistorySummary,
    CreatePortalDashboardInput,
    PortalDashboardSummary,
    CreatePortalSubscriptionInput,
    PortalSubscriptionSummary,
    CreatePortalBillingInput,
    PortalBillingSummary,
    CreatePortalSupportInput,
    PortalSupportSummary,
    CreateDocGuideInput,
    DocGuideSummary,
    CreateDocApiReferenceInput,
    DocApiReferenceSummary,
    CreateDocVersionInput,
    DocVersionSummary,
    CreateDemoOrganizationInput,
    DemoOrganizationSummary,
    CreateDemoDataSetInput,
    DemoDataSetSummary,
    CreateDemoUserInput,
    DemoUserSummary,
    CreateCompanyMetricInput,
    CompanyMetricSummary,
    CreateCompanyHealthInput,
    CompanyHealthSummary,
    CreateExecutiveKpiInput,
    ExecutiveKpiSummary,
    CreateCompanyFailureInput,
    CompanyFailureSummary,
    CmpDashboardStats,
    CmpPipelineInfo,
    AuditEntry } from "@/src/modules/company-foundation/types";

export function buildCompanyHubLookupMaps(hubs: DbCmpCompanyHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildCmpPipelineInfo(): CmpPipelineInfo {
    const stages = [
        { key: "brand", label: "Brand" },
        { key: "website", label: "Website" },
        { key: "pricing", label: "Pricing" },
        { key: "proposal", label: "Proposal" },
        { key: "customer_portal", label: "Customer Portal" },
    ];
    return { stages, currentStage: "proposal", nextStage: "customer_portal", previousStage: "pricing" };
}

export function buildCmpAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbCmpAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapCompanyHubSummary(record: DbCmpCompanyHub): CompanyHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildCompanyHubPayload(organizationId: string, input: CreateCompanyHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapBrandProfileSummary(record: DbCmpBrandProfile, maps?: { hubNameById: Map<string, string> }): BrandProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        brandStatus: record.brand_status as string,
        status: record.status,
    };
}

export function buildBrandProfilePayload(organizationId: string, input: CreateBrandProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        brand_status: input.brandStatus ?? '',
        status: "active",
    };
}

export function mapLogoAssetSummary(record: DbCmpLogoAsset, maps?: { hubNameById: Map<string, string> }): LogoAssetSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assetKey: record.asset_key as string,
        assetName: record.asset_name as string,
        assetType: record.asset_type as string,
        status: record.status,
    };
}

export function buildLogoAssetPayload(organizationId: string, input: CreateLogoAssetInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        asset_key: input.assetKey ?? '',
        asset_name: input.assetName ?? '',
        asset_type: input.assetType ?? '',
        status: "active",
    };
}

export function mapThemeConfigSummary(record: DbCmpThemeConfig, maps?: { hubNameById: Map<string, string> }): ThemeConfigSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        configKey: record.config_key as string,
        configName: record.config_name as string,
        primaryColor: record.primary_color as string,
        status: record.status,
    };
}

export function buildThemeConfigPayload(organizationId: string, input: CreateThemeConfigInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        config_key: input.configKey ?? '',
        config_name: input.configName ?? '',
        primary_color: input.primaryColor ?? '',
        status: "active",
    };
}

export function mapBrandAssetSummary(record: DbCmpBrandAsset, maps?: { hubNameById: Map<string, string> }): BrandAssetSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        assetKey: record.asset_key as string,
        assetName: record.asset_name as string,
        assetCategory: record.asset_category as string,
        status: record.status,
    };
}

export function buildBrandAssetPayload(organizationId: string, input: CreateBrandAssetInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        asset_key: input.assetKey ?? '',
        asset_name: input.assetName ?? '',
        asset_category: input.assetCategory ?? '',
        status: "active",
    };
}

export function mapWebsitePageSummary(record: DbCmpWebsitePage, maps?: { hubNameById: Map<string, string> }): WebsitePageSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        pageKey: record.page_key as string,
        pageTitle: record.page_title as string,
        pageSlug: record.page_slug as string,
        status: record.status,
    };
}

export function buildWebsitePagePayload(organizationId: string, input: CreateWebsitePageInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        page_key: input.pageKey ?? '',
        page_title: input.pageTitle ?? '',
        page_slug: input.pageSlug ?? '',
        status: "active",
    };
}

export function mapWebsiteFeatureSummary(record: DbCmpWebsiteFeature, maps?: { hubNameById: Map<string, string> }): WebsiteFeatureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        featureKey: record.feature_key as string,
        featureName: record.feature_name as string,
        featureType: record.feature_type as string,
        status: record.status,
    };
}

export function buildWebsiteFeaturePayload(organizationId: string, input: CreateWebsiteFeatureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        feature_key: input.featureKey ?? '',
        feature_name: input.featureName ?? '',
        feature_type: input.featureType ?? '',
        status: "active",
    };
}

export function mapWebsiteSectionSummary(record: DbCmpWebsiteSection, maps?: { hubNameById: Map<string, string> }): WebsiteSectionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        sectionKey: record.section_key as string,
        sectionName: record.section_name as string,
        sectionType: record.section_type as string,
        status: record.status,
    };
}

export function buildWebsiteSectionPayload(organizationId: string, input: CreateWebsiteSectionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        section_key: input.sectionKey ?? '',
        section_name: input.sectionName ?? '',
        section_type: input.sectionType ?? '',
        status: "active",
    };
}

export function mapDemoRequestSummary(record: DbCmpDemoRequest, maps?: { hubNameById: Map<string, string> }): DemoRequestSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        requestKey: record.request_key as string,
        requestName: record.request_name as string,
        requestStatus: record.request_status as string,
        status: record.status,
    };
}

export function buildDemoRequestPayload(organizationId: string, input: CreateDemoRequestInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        request_key: input.requestKey ?? '',
        request_name: input.requestName ?? '',
        request_status: input.requestStatus ?? '',
        status: "active",
    };
}

export function mapPricingPlanSummary(record: DbCmpPricingPlan, maps?: { hubNameById: Map<string, string> }): PricingPlanSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        planKey: record.plan_key as string,
        planName: record.plan_name as string,
        planTier: record.plan_tier as string,
        status: record.status,
    };
}

export function buildPricingPlanPayload(organizationId: string, input: CreatePricingPlanInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        plan_key: input.planKey ?? '',
        plan_name: input.planName ?? '',
        plan_tier: input.planTier ?? '',
        status: "active",
    };
}

export function mapPricingPackageSummary(record: DbCmpPricingPackage, maps?: { hubNameById: Map<string, string> }): PricingPackageSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        packageKey: record.package_key as string,
        packageName: record.package_name as string,
        packageType: record.package_type as string,
        status: record.status,
    };
}

export function buildPricingPackagePayload(organizationId: string, input: CreatePricingPackageInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        package_key: input.packageKey ?? '',
        package_name: input.packageName ?? '',
        package_type: input.packageType ?? '',
        status: "active",
    };
}

export function mapModulePricingSummary(record: DbCmpModulePricing, maps?: { hubNameById: Map<string, string> }): ModulePricingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        pricingKey: record.pricing_key as string,
        moduleName: record.module_name as string,
        priceAmount: record.price_amount as number,
        status: record.status,
    };
}

export function buildModulePricingPayload(organizationId: string, input: CreateModulePricingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        pricing_key: input.pricingKey ?? '',
        module_name: input.moduleName ?? '',
        price_amount: input.priceAmount ?? 0,
        status: "active",
    };
}

export function mapDiscountRuleSummary(record: DbCmpDiscountRule, maps?: { hubNameById: Map<string, string> }): DiscountRuleSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        ruleKey: record.rule_key as string,
        ruleName: record.rule_name as string,
        discountPercent: record.discount_percent as number,
        status: record.status,
    };
}

export function buildDiscountRulePayload(organizationId: string, input: CreateDiscountRuleInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        rule_key: input.ruleKey ?? '',
        rule_name: input.ruleName ?? '',
        discount_percent: input.discountPercent ?? 0,
        status: "active",
    };
}

export function mapProposalSummary(record: DbCmpProposal, maps?: { hubNameById: Map<string, string> }): ProposalSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        proposalKey: record.proposal_key as string,
        proposalName: record.proposal_name as string,
        proposalStatus: record.proposal_status as string,
        status: record.status,
    };
}

export function buildProposalPayload(organizationId: string, input: CreateProposalInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        proposal_key: input.proposalKey ?? '',
        proposal_name: input.proposalName ?? '',
        proposal_status: input.proposalStatus ?? '',
        status: "active",
    };
}

export function mapProposalDocumentSummary(record: DbCmpProposalDocument, maps?: { hubNameById: Map<string, string> }): ProposalDocumentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        documentKey: record.document_key as string,
        documentName: record.document_name as string,
        documentType: record.document_type as string,
        status: record.status,
    };
}

export function buildProposalDocumentPayload(organizationId: string, input: CreateProposalDocumentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        document_key: input.documentKey ?? '',
        document_name: input.documentName ?? '',
        document_type: input.documentType ?? '',
        status: "active",
    };
}

export function mapProposalContractSummary(record: DbCmpProposalContract, maps?: { hubNameById: Map<string, string> }): ProposalContractSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        contractKey: record.contract_key as string,
        contractName: record.contract_name as string,
        contractStatus: record.contract_status as string,
        status: record.status,
    };
}

export function buildProposalContractPayload(organizationId: string, input: CreateProposalContractInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        contract_key: input.contractKey ?? '',
        contract_name: input.contractName ?? '',
        contract_status: input.contractStatus ?? '',
        status: "active",
    };
}

export function mapProposalHistorySummary(record: DbCmpProposalHistory, maps?: { hubNameById: Map<string, string> }): ProposalHistorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        historyKey: record.history_key as string,
        historyType: record.history_type as string,
        changedAt: record.changed_at as string,
        status: record.status,
    };
}

export function buildProposalHistoryPayload(organizationId: string, input: CreateProposalHistoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        history_key: input.historyKey ?? '',
        history_type: input.historyType ?? '',
        changed_at: input.changedAt ?? '',
        status: "active",
    };
}

export function mapPortalDashboardSummary(record: DbCmpPortalDashboard, maps?: { hubNameById: Map<string, string> }): PortalDashboardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        dashboardKey: record.dashboard_key as string,
        dashboardName: record.dashboard_name as string,
        dashboardType: record.dashboard_type as string,
        status: record.status,
    };
}

export function buildPortalDashboardPayload(organizationId: string, input: CreatePortalDashboardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        dashboard_key: input.dashboardKey ?? '',
        dashboard_name: input.dashboardName ?? '',
        dashboard_type: input.dashboardType ?? '',
        status: "active",
    };
}

export function mapPortalSubscriptionSummary(record: DbCmpPortalSubscription, maps?: { hubNameById: Map<string, string> }): PortalSubscriptionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        subscriptionKey: record.subscription_key as string,
        planName: record.plan_name as string,
        subscriptionStatus: record.subscription_status as string,
        status: record.status,
    };
}

export function buildPortalSubscriptionPayload(organizationId: string, input: CreatePortalSubscriptionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        subscription_key: input.subscriptionKey ?? '',
        plan_name: input.planName ?? '',
        subscription_status: input.subscriptionStatus ?? '',
        status: "active",
    };
}

export function mapPortalBillingSummary(record: DbCmpPortalBilling, maps?: { hubNameById: Map<string, string> }): PortalBillingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        billingKey: record.billing_key as string,
        billingType: record.billing_type as string,
        billingAmount: record.billing_amount as number,
        status: record.status,
    };
}

export function buildPortalBillingPayload(organizationId: string, input: CreatePortalBillingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        billing_key: input.billingKey ?? '',
        billing_type: input.billingType ?? '',
        billing_amount: input.billingAmount ?? 0,
        status: "active",
    };
}

export function mapPortalSupportSummary(record: DbCmpPortalSupport, maps?: { hubNameById: Map<string, string> }): PortalSupportSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        supportKey: record.support_key as string,
        supportTitle: record.support_title as string,
        supportStatus: record.support_status as string,
        status: record.status,
    };
}

export function buildPortalSupportPayload(organizationId: string, input: CreatePortalSupportInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        support_key: input.supportKey ?? '',
        support_title: input.supportTitle ?? '',
        support_status: input.supportStatus ?? '',
        status: "active",
    };
}

export function mapDocGuideSummary(record: DbCmpDocGuide, maps?: { hubNameById: Map<string, string> }): DocGuideSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        guideKey: record.guide_key as string,
        guideTitle: record.guide_title as string,
        guideCategory: record.guide_category as string,
        status: record.status,
    };
}

export function buildDocGuidePayload(organizationId: string, input: CreateDocGuideInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        guide_key: input.guideKey ?? '',
        guide_title: input.guideTitle ?? '',
        guide_category: input.guideCategory ?? '',
        status: "active",
    };
}

export function mapDocApiReferenceSummary(record: DbCmpDocApiReference, maps?: { hubNameById: Map<string, string> }): DocApiReferenceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        referenceKey: record.reference_key as string,
        referenceName: record.reference_name as string,
        apiVersion: record.api_version as string,
        status: record.status,
    };
}

export function buildDocApiReferencePayload(organizationId: string, input: CreateDocApiReferenceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        reference_key: input.referenceKey ?? '',
        reference_name: input.referenceName ?? '',
        api_version: input.apiVersion ?? '',
        status: "active",
    };
}

export function mapDocVersionSummary(record: DbCmpDocVersion, maps?: { hubNameById: Map<string, string> }): DocVersionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        versionKey: record.version_key as string,
        versionName: record.version_name as string,
        versionNumber: record.version_number as string,
        status: record.status,
    };
}

export function buildDocVersionPayload(organizationId: string, input: CreateDocVersionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        version_key: input.versionKey ?? '',
        version_name: input.versionName ?? '',
        version_number: input.versionNumber ?? '',
        status: "active",
    };
}

export function mapDemoOrganizationSummary(record: DbCmpDemoOrganization, maps?: { hubNameById: Map<string, string> }): DemoOrganizationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        orgKey: record.org_key as string,
        orgName: record.org_name as string,
        orgType: record.org_type as string,
        status: record.status,
    };
}

export function buildDemoOrganizationPayload(organizationId: string, input: CreateDemoOrganizationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        org_key: input.orgKey ?? '',
        org_name: input.orgName ?? '',
        org_type: input.orgType ?? '',
        status: "active",
    };
}

export function mapDemoDataSetSummary(record: DbCmpDemoDataSet, maps?: { hubNameById: Map<string, string> }): DemoDataSetSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        datasetKey: record.dataset_key as string,
        datasetName: record.dataset_name as string,
        recordCount: record.record_count as number,
        status: record.status,
    };
}

export function buildDemoDataSetPayload(organizationId: string, input: CreateDemoDataSetInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        dataset_key: input.datasetKey ?? '',
        dataset_name: input.datasetName ?? '',
        record_count: input.recordCount ?? 0,
        status: "active",
    };
}

export function mapDemoUserSummary(record: DbCmpDemoUser, maps?: { hubNameById: Map<string, string> }): DemoUserSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        userKey: record.user_key as string,
        userName: record.user_name as string,
        userRole: record.user_role as string,
        status: record.status,
    };
}

export function buildDemoUserPayload(organizationId: string, input: CreateDemoUserInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        user_key: input.userKey ?? '',
        user_name: input.userName ?? '',
        user_role: input.userRole ?? '',
        status: "active",
    };
}

export function mapCompanyMetricSummary(record: DbCmpCompanyMetric): CompanyMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        overallCompanyScore: record.overall_company_score as number,
        platformHealthScore: record.platform_health_score as number,
        status: record.status,
    };
}

export function buildCompanyMetricPayload(organizationId: string, input: CreateCompanyMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        overall_company_score: input.overallCompanyScore ?? 0,
        platform_health_score: input.platformHealthScore ?? 0,
        status: "active",
    };
}

export function mapCompanyHealthSummary(record: DbCmpCompanyHealth): CompanyHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildCompanyHealthPayload(organizationId: string, input: CreateCompanyHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapExecutiveKpiSummary(record: DbCmpExecutiveKpi, maps?: { hubNameById: Map<string, string> }): ExecutiveKpiSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        kpiKey: record.kpi_key as string,
        kpiName: record.kpi_name as string,
        kpiScore: record.kpi_score as number,
        status: record.status,
    };
}

export function buildExecutiveKpiPayload(organizationId: string, input: CreateExecutiveKpiInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        kpi_key: input.kpiKey ?? '',
        kpi_name: input.kpiName ?? '',
        kpi_score: input.kpiScore ?? 0,
        status: "active",
    };
}

export function mapCompanyFailureSummary(record: DbCmpCompanyFailure, maps?: { hubNameById: Map<string, string> }): CompanyFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildCompanyFailurePayload(organizationId: string, input: CreateCompanyFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.companyHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapBrandProfileForStats(r: DbCmpBrandProfile) { return { status: r.status }; }
export function mapWebsitePageForStats(r: DbCmpWebsitePage) { return { status: r.status }; }
export function mapPricingPlanForStats(r: DbCmpPricingPlan) { return { status: r.status }; }
export function mapProposalForStats(r: DbCmpProposal) { return { proposal_status: r.proposal_status, status: r.status }; }
export function mapPortalDashboardForStats(r: DbCmpPortalDashboard) { return { status: r.status }; }
export function mapCompanyMetricForStats(r: DbCmpCompanyMetric) {
    return {
        website_analytics_score: r.website_analytics_score,
        demo_request_count: r.demo_request_count,
        active_customer_count: r.active_customer_count,
        revenue_total: r.revenue_total,
        proposal_pending_count: r.proposal_pending_count,
        support_open_count: r.support_open_count,
        platform_health_score: r.platform_health_score,
        overall_company_score: r.overall_company_score,
        status: r.status,
    };
}
export function mapCompanyHealthForStats(r: DbCmpCompanyHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapCompanyFailureForStats(r: DbCmpCompanyFailure) { return { status: r.status }; }

export function buildCmpDashboardStats(input: {
    companyHubs: CompanyHubSummary[];
    brandProfiles: ReturnType<typeof mapBrandProfileForStats>[];
    companyMetrics: ReturnType<typeof mapCompanyMetricForStats>[];
    websitePages: ReturnType<typeof mapWebsitePageForStats>[];
    pricingPlans: ReturnType<typeof mapPricingPlanForStats>[];
    proposals: ReturnType<typeof mapProposalForStats>[];
    portalDashboards: ReturnType<typeof mapPortalDashboardForStats>[];
    companyHealth: ReturnType<typeof mapCompanyHealthForStats>[];
    companyFailures: CompanyFailureSummary[];
    auditLogs: AuditEntry[];
}): CmpDashboardStats {
    const activeHubs = input.companyHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.companyMetrics[0];
    const latestHealth = input.companyHealth[0];
    return {
        totalCompanyHubs: input.companyHubs.length,
        activeCompanyHubs: activeHubs,
        brandProfileCount: input.brandProfiles.length,
        websitePageCount: input.websitePages.length,
        pricingPlanCount: input.pricingPlans.length,
        proposalCount: input.proposals.length,
        portalDashboardCount: input.portalDashboards.length,
        openCompanyFailureCount: input.companyFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallCompanyScore: latestMetrics?.overall_company_score ?? latestHealth?.overall_score ?? 0,
        websiteAnalyticsScore: latestMetrics?.website_analytics_score ?? 0,
        demoRequestCount: latestMetrics?.demo_request_count ?? 0,
        activeCustomerCount: latestMetrics?.active_customer_count ?? 0,
        revenueTotal: latestMetrics?.revenue_total ?? 0,
        proposalPendingCount: latestMetrics?.proposal_pending_count ?? 0,
        supportOpenCount: latestMetrics?.support_open_count ?? 0,
        platformHealthScore: latestMetrics?.platform_health_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
