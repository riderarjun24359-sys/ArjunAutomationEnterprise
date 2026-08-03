import { z } from "zod";

export const restaurantHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type restaurantHubsFormValues = z.infer<typeof restaurantHubsFormSchema>;

export const brandsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    brandKey: z.string().min(1).optional(),
    brandName: z.string().min(1).optional(),
    brandType: z.string().min(1).optional(),
});

export type brandsFormValues = z.infer<typeof brandsFormSchema>;

export const branchesFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    branchKey: z.string().min(1).optional(),
    branchName: z.string().min(1).optional(),
    branchAddress: z.string().min(1).optional(),
});

export type branchesFormValues = z.infer<typeof branchesFormSchema>;

export const businessLicensesFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    licenseKey: z.string().min(1).optional(),
    licenseName: z.string().min(1).optional(),
    licenseType: z.string().min(1).optional(),
});

export type businessLicensesFormValues = z.infer<typeof businessLicensesFormSchema>;

export const diningAreasFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    areaKey: z.string().min(1).optional(),
    areaName: z.string().min(1).optional(),
    areaType: z.string().min(1).optional(),
});

export type diningAreasFormValues = z.infer<typeof diningAreasFormSchema>;

export const restaurantTablesFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    tableKey: z.string().min(1).optional(),
    tableName: z.string().min(1).optional(),
    tableStatus: z.string().min(1).optional(),
});

export type restaurantTablesFormValues = z.infer<typeof restaurantTablesFormSchema>;

export const menuCategoriesFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    categoryKey: z.string().min(1).optional(),
    categoryName: z.string().min(1).optional(),
    categoryType: z.string().min(1).optional(),
});

export type menuCategoriesFormValues = z.infer<typeof menuCategoriesFormSchema>;

export const menuItemsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    itemKey: z.string().min(1).optional(),
    itemName: z.string().min(1).optional(),
    itemPrice: z.number().optional(),
});

export type menuItemsFormValues = z.infer<typeof menuItemsFormSchema>;

export const menuVariantsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    variantKey: z.string().min(1).optional(),
    variantName: z.string().min(1).optional(),
    variantType: z.string().min(1).optional(),
});

export type menuVariantsFormValues = z.infer<typeof menuVariantsFormSchema>;

export const addOnsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    addonKey: z.string().min(1).optional(),
    addonName: z.string().min(1).optional(),
    addonPrice: z.number().optional(),
});

export type addOnsFormValues = z.infer<typeof addOnsFormSchema>;

export const comboMealsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    comboKey: z.string().min(1).optional(),
    comboName: z.string().min(1).optional(),
    comboPrice: z.number().optional(),
});

export type comboMealsFormValues = z.infer<typeof comboMealsFormSchema>;

export const ordersFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    orderKey: z.string().min(1).optional(),
    orderNumber: z.string().min(1).optional(),
    orderType: z.string().min(1).optional(),
});

export type ordersFormValues = z.infer<typeof ordersFormSchema>;

export const orderItemsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    itemKey: z.string().min(1).optional(),
    itemName: z.string().min(1).optional(),
    itemQuantity: z.number().optional(),
});

export type orderItemsFormValues = z.infer<typeof orderItemsFormSchema>;

export const orderQueueFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    queueKey: z.string().min(1).optional(),
    queueName: z.string().min(1).optional(),
    queueStatus: z.string().min(1).optional(),
});

export type orderQueueFormValues = z.infer<typeof orderQueueFormSchema>;

export const kitchenRoutingFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    routingKey: z.string().min(1).optional(),
    routingName: z.string().min(1).optional(),
    routingStatus: z.string().min(1).optional(),
});

export type kitchenRoutingFormValues = z.infer<typeof kitchenRoutingFormSchema>;

export const orderTimelineFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    timelineKey: z.string().min(1).optional(),
    timelineEvent: z.string().min(1).optional(),
    timelineStatus: z.string().min(1).optional(),
});

export type orderTimelineFormValues = z.infer<typeof orderTimelineFormSchema>;

export const kitchenStationsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    stationKey: z.string().min(1).optional(),
    stationName: z.string().min(1).optional(),
    stationType: z.string().min(1).optional(),
});

export type kitchenStationsFormValues = z.infer<typeof kitchenStationsFormSchema>;

export const preparationQueueFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    prepKey: z.string().min(1).optional(),
    prepName: z.string().min(1).optional(),
    prepStatus: z.string().min(1).optional(),
});

export type preparationQueueFormValues = z.infer<typeof preparationQueueFormSchema>;

export const cookingStatusFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    cookingKey: z.string().min(1).optional(),
    cookingName: z.string().min(1).optional(),
    cookingStatus: z.string().min(1).optional(),
});

export type cookingStatusFormValues = z.infer<typeof cookingStatusFormSchema>;

export const readyQueueFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    readyKey: z.string().min(1).optional(),
    readyName: z.string().min(1).optional(),
    readyStatus: z.string().min(1).optional(),
});

export type readyQueueFormValues = z.infer<typeof readyQueueFormSchema>;

export const rushOrdersFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    rushKey: z.string().min(1).optional(),
    rushName: z.string().min(1).optional(),
    rushPriority: z.string().min(1).optional(),
});

export type rushOrdersFormValues = z.infer<typeof rushOrdersFormSchema>;

export const reservationsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    reservationKey: z.string().min(1).optional(),
    reservationName: z.string().min(1).optional(),
    reservationStatus: z.string().min(1).optional(),
});

export type reservationsFormValues = z.infer<typeof reservationsFormSchema>;

export const waitingListFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    waitKey: z.string().min(1).optional(),
    waitName: z.string().min(1).optional(),
    waitStatus: z.string().min(1).optional(),
});

export type waitingListFormValues = z.infer<typeof waitingListFormSchema>;

export const customerProfilesFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    profileType: z.string().min(1).optional(),
});

export type customerProfilesFormValues = z.infer<typeof customerProfilesFormSchema>;

export const loyaltyProgramsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    programKey: z.string().min(1).optional(),
    programName: z.string().min(1).optional(),
    programType: z.string().min(1).optional(),
});

export type loyaltyProgramsFormValues = z.infer<typeof loyaltyProgramsFormSchema>;

export const feedbackReviewsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    reviewKey: z.string().min(1).optional(),
    reviewTitle: z.string().min(1).optional(),
    reviewRating: z.number().optional(),
});

export type feedbackReviewsFormValues = z.infer<typeof feedbackReviewsFormSchema>;

export const restaurantMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    orderCount: z.number().optional(),
    overallRestaurantScore: z.number().optional(),
});

export type restaurantMetricsFormValues = z.infer<typeof restaurantMetricsFormSchema>;

export const restaurantHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type restaurantHealthFormValues = z.infer<typeof restaurantHealthFormSchema>;

export const revenueAnalyticsFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type revenueAnalyticsFormValues = z.infer<typeof revenueAnalyticsFormSchema>;

export const kitchenPerformanceFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    performanceKey: z.string().min(1).optional(),
    performanceType: z.string().min(1).optional(),
    performanceScore: z.number().optional(),
});

export type kitchenPerformanceFormValues = z.infer<typeof kitchenPerformanceFormSchema>;

export const restaurantFailuresFormSchema = z.object({
    restaurantHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type restaurantFailuresFormValues = z.infer<typeof restaurantFailuresFormSchema>;
