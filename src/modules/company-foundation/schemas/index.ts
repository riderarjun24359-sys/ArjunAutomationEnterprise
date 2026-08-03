import { z } from "zod";

export const companyHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type companyHubsFormValues = z.infer<typeof companyHubsFormSchema>;

export const brandProfilesFormSchema = z.object({
    companyHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    brandStatus: z.string().min(1).optional(),
});

export type brandProfilesFormValues = z.infer<typeof brandProfilesFormSchema>;

export const logoAssetsFormSchema = z.object({
    companyHubId: z.string().min(1),
    assetKey: z.string().min(1).optional(),
    assetName: z.string().min(1).optional(),
    assetType: z.string().min(1).optional(),
});

export type logoAssetsFormValues = z.infer<typeof logoAssetsFormSchema>;

export const themeConfigsFormSchema = z.object({
    companyHubId: z.string().min(1),
    configKey: z.string().min(1).optional(),
    configName: z.string().min(1).optional(),
    primaryColor: z.string().min(1).optional(),
});

export type themeConfigsFormValues = z.infer<typeof themeConfigsFormSchema>;

export const brandAssetsFormSchema = z.object({
    companyHubId: z.string().min(1),
    assetKey: z.string().min(1).optional(),
    assetName: z.string().min(1).optional(),
    assetCategory: z.string().min(1).optional(),
});

export type brandAssetsFormValues = z.infer<typeof brandAssetsFormSchema>;

export const websitePagesFormSchema = z.object({
    companyHubId: z.string().min(1),
    pageKey: z.string().min(1).optional(),
    pageTitle: z.string().min(1).optional(),
    pageSlug: z.string().min(1).optional(),
});

export type websitePagesFormValues = z.infer<typeof websitePagesFormSchema>;

export const websiteFeaturesFormSchema = z.object({
    companyHubId: z.string().min(1),
    featureKey: z.string().min(1).optional(),
    featureName: z.string().min(1).optional(),
    featureType: z.string().min(1).optional(),
});

export type websiteFeaturesFormValues = z.infer<typeof websiteFeaturesFormSchema>;

export const websiteSectionsFormSchema = z.object({
    companyHubId: z.string().min(1),
    sectionKey: z.string().min(1).optional(),
    sectionName: z.string().min(1).optional(),
    sectionType: z.string().min(1).optional(),
});

export type websiteSectionsFormValues = z.infer<typeof websiteSectionsFormSchema>;

export const demoRequestsFormSchema = z.object({
    companyHubId: z.string().min(1),
    requestKey: z.string().min(1).optional(),
    requestName: z.string().min(1).optional(),
    requestStatus: z.string().min(1).optional(),
});

export type demoRequestsFormValues = z.infer<typeof demoRequestsFormSchema>;

export const pricingPlansFormSchema = z.object({
    companyHubId: z.string().min(1),
    planKey: z.string().min(1).optional(),
    planName: z.string().min(1).optional(),
    planTier: z.string().min(1).optional(),
});

export type pricingPlansFormValues = z.infer<typeof pricingPlansFormSchema>;

export const pricingPackagesFormSchema = z.object({
    companyHubId: z.string().min(1),
    packageKey: z.string().min(1).optional(),
    packageName: z.string().min(1).optional(),
    packageType: z.string().min(1).optional(),
});

export type pricingPackagesFormValues = z.infer<typeof pricingPackagesFormSchema>;

export const modulePricingFormSchema = z.object({
    companyHubId: z.string().min(1),
    pricingKey: z.string().min(1).optional(),
    moduleName: z.string().min(1).optional(),
    priceAmount: z.number().optional(),
});

export type modulePricingFormValues = z.infer<typeof modulePricingFormSchema>;

export const discountRulesFormSchema = z.object({
    companyHubId: z.string().min(1),
    ruleKey: z.string().min(1).optional(),
    ruleName: z.string().min(1).optional(),
    discountPercent: z.number().optional(),
});

export type discountRulesFormValues = z.infer<typeof discountRulesFormSchema>;

export const proposalsFormSchema = z.object({
    companyHubId: z.string().min(1),
    proposalKey: z.string().min(1).optional(),
    proposalName: z.string().min(1).optional(),
    proposalStatus: z.string().min(1).optional(),
});

export type proposalsFormValues = z.infer<typeof proposalsFormSchema>;

export const proposalDocumentsFormSchema = z.object({
    companyHubId: z.string().min(1),
    documentKey: z.string().min(1).optional(),
    documentName: z.string().min(1).optional(),
    documentType: z.string().min(1).optional(),
});

export type proposalDocumentsFormValues = z.infer<typeof proposalDocumentsFormSchema>;

export const proposalContractsFormSchema = z.object({
    companyHubId: z.string().min(1),
    contractKey: z.string().min(1).optional(),
    contractName: z.string().min(1).optional(),
    contractStatus: z.string().min(1).optional(),
});

export type proposalContractsFormValues = z.infer<typeof proposalContractsFormSchema>;

export const proposalHistoryFormSchema = z.object({
    companyHubId: z.string().min(1),
    historyKey: z.string().min(1).optional(),
    historyType: z.string().min(1).optional(),
    changedAt: z.string().min(1).optional(),
});

export type proposalHistoryFormValues = z.infer<typeof proposalHistoryFormSchema>;

export const portalDashboardsFormSchema = z.object({
    companyHubId: z.string().min(1),
    dashboardKey: z.string().min(1).optional(),
    dashboardName: z.string().min(1).optional(),
    dashboardType: z.string().min(1).optional(),
});

export type portalDashboardsFormValues = z.infer<typeof portalDashboardsFormSchema>;

export const portalSubscriptionsFormSchema = z.object({
    companyHubId: z.string().min(1),
    subscriptionKey: z.string().min(1).optional(),
    planName: z.string().min(1).optional(),
    subscriptionStatus: z.string().min(1).optional(),
});

export type portalSubscriptionsFormValues = z.infer<typeof portalSubscriptionsFormSchema>;

export const portalBillingFormSchema = z.object({
    companyHubId: z.string().min(1),
    billingKey: z.string().min(1).optional(),
    billingType: z.string().min(1).optional(),
    billingAmount: z.number().optional(),
});

export type portalBillingFormValues = z.infer<typeof portalBillingFormSchema>;

export const portalSupportFormSchema = z.object({
    companyHubId: z.string().min(1),
    supportKey: z.string().min(1).optional(),
    supportTitle: z.string().min(1).optional(),
    supportStatus: z.string().min(1).optional(),
});

export type portalSupportFormValues = z.infer<typeof portalSupportFormSchema>;

export const docGuidesFormSchema = z.object({
    companyHubId: z.string().min(1),
    guideKey: z.string().min(1).optional(),
    guideTitle: z.string().min(1).optional(),
    guideCategory: z.string().min(1).optional(),
});

export type docGuidesFormValues = z.infer<typeof docGuidesFormSchema>;

export const docApiReferencesFormSchema = z.object({
    companyHubId: z.string().min(1),
    referenceKey: z.string().min(1).optional(),
    referenceName: z.string().min(1).optional(),
    apiVersion: z.string().min(1).optional(),
});

export type docApiReferencesFormValues = z.infer<typeof docApiReferencesFormSchema>;

export const docVersionsFormSchema = z.object({
    companyHubId: z.string().min(1),
    versionKey: z.string().min(1).optional(),
    versionName: z.string().min(1).optional(),
    versionNumber: z.string().min(1).optional(),
});

export type docVersionsFormValues = z.infer<typeof docVersionsFormSchema>;

export const demoOrganizationsFormSchema = z.object({
    companyHubId: z.string().min(1),
    orgKey: z.string().min(1).optional(),
    orgName: z.string().min(1).optional(),
    orgType: z.string().min(1).optional(),
});

export type demoOrganizationsFormValues = z.infer<typeof demoOrganizationsFormSchema>;

export const demoDataSetsFormSchema = z.object({
    companyHubId: z.string().min(1),
    datasetKey: z.string().min(1).optional(),
    datasetName: z.string().min(1).optional(),
    recordCount: z.number().optional(),
});

export type demoDataSetsFormValues = z.infer<typeof demoDataSetsFormSchema>;

export const demoUsersFormSchema = z.object({
    companyHubId: z.string().min(1),
    userKey: z.string().min(1).optional(),
    userName: z.string().min(1).optional(),
    userRole: z.string().min(1).optional(),
});

export type demoUsersFormValues = z.infer<typeof demoUsersFormSchema>;

export const companyMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    overallCompanyScore: z.number().optional(),
    platformHealthScore: z.number().optional(),
});

export type companyMetricsFormValues = z.infer<typeof companyMetricsFormSchema>;

export const companyHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type companyHealthFormValues = z.infer<typeof companyHealthFormSchema>;

export const executiveKpisFormSchema = z.object({
    companyHubId: z.string().min(1),
    kpiKey: z.string().min(1).optional(),
    kpiName: z.string().min(1).optional(),
    kpiScore: z.number().optional(),
});

export type executiveKpisFormValues = z.infer<typeof executiveKpisFormSchema>;

export const companyFailuresFormSchema = z.object({
    companyHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type companyFailuresFormValues = z.infer<typeof companyFailuresFormSchema>;
