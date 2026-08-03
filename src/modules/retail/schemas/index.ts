import { z } from "zod";

export const retailHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type retailHubsFormValues = z.infer<typeof retailHubsFormSchema>;

export const retailBrandsFormSchema = z.object({
    retailHubId: z.string().min(1),
    brandKey: z.string().min(1).optional(),
    brandName: z.string().min(1).optional(),
    brandType: z.string().min(1).optional(),
});

export type retailBrandsFormValues = z.infer<typeof retailBrandsFormSchema>;

export const storesFormSchema = z.object({
    retailHubId: z.string().min(1),
    storeKey: z.string().min(1).optional(),
    storeName: z.string().min(1).optional(),
    storeType: z.string().min(1).optional(),
});

export type storesFormValues = z.infer<typeof storesFormSchema>;

export const cashRegistersFormSchema = z.object({
    retailHubId: z.string().min(1),
    registerKey: z.string().min(1).optional(),
    registerName: z.string().min(1).optional(),
    registerStatus: z.string().min(1).optional(),
});

export type cashRegistersFormValues = z.infer<typeof cashRegistersFormSchema>;

export const storeDepartmentsFormSchema = z.object({
    retailHubId: z.string().min(1),
    departmentKey: z.string().min(1).optional(),
    departmentName: z.string().min(1).optional(),
    departmentType: z.string().min(1).optional(),
});

export type storeDepartmentsFormValues = z.infer<typeof storeDepartmentsFormSchema>;

export const productsFormSchema = z.object({
    retailHubId: z.string().min(1),
    productKey: z.string().min(1).optional(),
    productName: z.string().min(1).optional(),
    productType: z.string().min(1).optional(),
});

export type productsFormValues = z.infer<typeof productsFormSchema>;

export const productCategoriesFormSchema = z.object({
    retailHubId: z.string().min(1),
    categoryKey: z.string().min(1).optional(),
    categoryName: z.string().min(1).optional(),
    categoryType: z.string().min(1).optional(),
});

export type productCategoriesFormValues = z.infer<typeof productCategoriesFormSchema>;

export const productVariantsFormSchema = z.object({
    retailHubId: z.string().min(1),
    variantKey: z.string().min(1).optional(),
    variantName: z.string().min(1).optional(),
    variantType: z.string().min(1).optional(),
});

export type productVariantsFormValues = z.infer<typeof productVariantsFormSchema>;

export const promotionsFormSchema = z.object({
    retailHubId: z.string().min(1),
    promotionKey: z.string().min(1).optional(),
    promotionName: z.string().min(1).optional(),
    promotionStatus: z.string().min(1).optional(),
});

export type promotionsFormValues = z.infer<typeof promotionsFormSchema>;

export const salesOrdersFormSchema = z.object({
    retailHubId: z.string().min(1),
    orderKey: z.string().min(1).optional(),
    orderName: z.string().min(1).optional(),
    orderStatus: z.string().min(1).optional(),
});

export type salesOrdersFormValues = z.infer<typeof salesOrdersFormSchema>;

export const posTransactionsFormSchema = z.object({
    retailHubId: z.string().min(1),
    transactionKey: z.string().min(1).optional(),
    transactionName: z.string().min(1).optional(),
    transactionStatus: z.string().min(1).optional(),
});

export type posTransactionsFormValues = z.infer<typeof posTransactionsFormSchema>;

export const returnsExchangesFormSchema = z.object({
    retailHubId: z.string().min(1),
    returnKey: z.string().min(1).optional(),
    returnName: z.string().min(1).optional(),
    returnStatus: z.string().min(1).optional(),
});

export type returnsExchangesFormValues = z.infer<typeof returnsExchangesFormSchema>;

export const shiftClosingsFormSchema = z.object({
    retailHubId: z.string().min(1),
    closingKey: z.string().min(1).optional(),
    closingName: z.string().min(1).optional(),
    closingStatus: z.string().min(1).optional(),
});

export type shiftClosingsFormValues = z.infer<typeof shiftClosingsFormSchema>;

export const warehousesFormSchema = z.object({
    retailHubId: z.string().min(1),
    warehouseKey: z.string().min(1).optional(),
    warehouseName: z.string().min(1).optional(),
    warehouseType: z.string().min(1).optional(),
});

export type warehousesFormValues = z.infer<typeof warehousesFormSchema>;

export const stockLevelsFormSchema = z.object({
    retailHubId: z.string().min(1),
    stockKey: z.string().min(1).optional(),
    stockName: z.string().min(1).optional(),
    stockQuantity: z.number().optional(),
});

export type stockLevelsFormValues = z.infer<typeof stockLevelsFormSchema>;

export const purchaseOrdersFormSchema = z.object({
    retailHubId: z.string().min(1),
    orderKey: z.string().min(1).optional(),
    orderName: z.string().min(1).optional(),
    orderStatus: z.string().min(1).optional(),
});

export type purchaseOrdersFormValues = z.infer<typeof purchaseOrdersFormSchema>;

export const suppliersFormSchema = z.object({
    retailHubId: z.string().min(1),
    supplierKey: z.string().min(1).optional(),
    supplierName: z.string().min(1).optional(),
    supplierType: z.string().min(1).optional(),
});

export type suppliersFormValues = z.infer<typeof suppliersFormSchema>;

export const customerProfilesFormSchema = z.object({
    retailHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    profileType: z.string().min(1).optional(),
});

export type customerProfilesFormValues = z.infer<typeof customerProfilesFormSchema>;

export const loyaltyProgramsFormSchema = z.object({
    retailHubId: z.string().min(1),
    programKey: z.string().min(1).optional(),
    programName: z.string().min(1).optional(),
    programType: z.string().min(1).optional(),
});

export type loyaltyProgramsFormValues = z.infer<typeof loyaltyProgramsFormSchema>;

export const rewardPointsFormSchema = z.object({
    retailHubId: z.string().min(1),
    pointsKey: z.string().min(1).optional(),
    pointsName: z.string().min(1).optional(),
    pointsBalance: z.number().optional(),
});

export type rewardPointsFormValues = z.infer<typeof rewardPointsFormSchema>;

export const campaignsFormSchema = z.object({
    retailHubId: z.string().min(1),
    campaignKey: z.string().min(1).optional(),
    campaignName: z.string().min(1).optional(),
    campaignStatus: z.string().min(1).optional(),
});

export type campaignsFormValues = z.infer<typeof campaignsFormSchema>;

export const dailyClosingsFormSchema = z.object({
    retailHubId: z.string().min(1),
    closingKey: z.string().min(1).optional(),
    closingName: z.string().min(1).optional(),
    closingAmount: z.number().optional(),
});

export type dailyClosingsFormValues = z.infer<typeof dailyClosingsFormSchema>;

export const branchPerformanceFormSchema = z.object({
    retailHubId: z.string().min(1),
    performanceKey: z.string().min(1).optional(),
    performanceName: z.string().min(1).optional(),
    performanceScore: z.number().optional(),
});

export type branchPerformanceFormValues = z.infer<typeof branchPerformanceFormSchema>;

export const commissionRecordsFormSchema = z.object({
    retailHubId: z.string().min(1),
    commissionKey: z.string().min(1).optional(),
    commissionName: z.string().min(1).optional(),
    commissionAmount: z.number().optional(),
});

export type commissionRecordsFormValues = z.infer<typeof commissionRecordsFormSchema>;

export const salesAnalyticsFormSchema = z.object({
    retailHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type salesAnalyticsFormValues = z.infer<typeof salesAnalyticsFormSchema>;

export const inventoryAnalyticsFormSchema = z.object({
    retailHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type inventoryAnalyticsFormValues = z.infer<typeof inventoryAnalyticsFormSchema>;

export const profitabilityAnalyticsFormSchema = z.object({
    retailHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type profitabilityAnalyticsFormValues = z.infer<typeof profitabilityAnalyticsFormSchema>;

export const retailMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    revenueTotal: z.number().optional(),
    overallRetailScore: z.number().optional(),
});

export type retailMetricsFormValues = z.infer<typeof retailMetricsFormSchema>;

export const retailHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type retailHealthFormValues = z.infer<typeof retailHealthFormSchema>;

export const executiveKpisFormSchema = z.object({
    retailHubId: z.string().min(1),
    kpiKey: z.string().min(1).optional(),
    kpiName: z.string().min(1).optional(),
    kpiScore: z.number().optional(),
});

export type executiveKpisFormValues = z.infer<typeof executiveKpisFormSchema>;

export const retailFailuresFormSchema = z.object({
    retailHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type retailFailuresFormValues = z.infer<typeof retailFailuresFormSchema>;
