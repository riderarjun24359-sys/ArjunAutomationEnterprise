import { z } from "zod";

export const hospitalHubsFormSchema = z.object({
    hubKey: z.string().min(1).optional(),
    hubName: z.string().min(1).optional(),
    environment: z.string().min(1).optional(),
});

export type hospitalHubsFormValues = z.infer<typeof hospitalHubsFormSchema>;

export const campusesFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    campusKey: z.string().min(1).optional(),
    campusName: z.string().min(1).optional(),
    campusType: z.string().min(1).optional(),
});

export type campusesFormValues = z.infer<typeof campusesFormSchema>;

export const departmentsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    departmentKey: z.string().min(1).optional(),
    departmentName: z.string().min(1).optional(),
    departmentType: z.string().min(1).optional(),
});

export type departmentsFormValues = z.infer<typeof departmentsFormSchema>;

export const wardsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    wardKey: z.string().min(1).optional(),
    wardName: z.string().min(1).optional(),
    wardType: z.string().min(1).optional(),
});

export type wardsFormValues = z.infer<typeof wardsFormSchema>;

export const hospitalBedsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    bedKey: z.string().min(1).optional(),
    bedNumber: z.string().min(1).optional(),
    bedStatus: z.string().min(1).optional(),
});

export type hospitalBedsFormValues = z.infer<typeof hospitalBedsFormSchema>;

export const patientRegistrationsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    registrationKey: z.string().min(1).optional(),
    registrationName: z.string().min(1).optional(),
    registrationStatus: z.string().min(1).optional(),
});

export type patientRegistrationsFormValues = z.infer<typeof patientRegistrationsFormSchema>;

export const patientProfilesFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    profileKey: z.string().min(1).optional(),
    profileName: z.string().min(1).optional(),
    profileType: z.string().min(1).optional(),
});

export type patientProfilesFormValues = z.infer<typeof patientProfilesFormSchema>;

export const medicalHistoriesFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    historyKey: z.string().min(1).optional(),
    historyName: z.string().min(1).optional(),
    historyType: z.string().min(1).optional(),
});

export type medicalHistoriesFormValues = z.infer<typeof medicalHistoriesFormSchema>;

export const insurancePoliciesFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    policyKey: z.string().min(1).optional(),
    policyName: z.string().min(1).optional(),
    policyType: z.string().min(1).optional(),
});

export type insurancePoliciesFormValues = z.infer<typeof insurancePoliciesFormSchema>;

export const appointmentsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    appointmentKey: z.string().min(1).optional(),
    appointmentName: z.string().min(1).optional(),
    appointmentStatus: z.string().min(1).optional(),
});

export type appointmentsFormValues = z.infer<typeof appointmentsFormSchema>;

export const opdVisitsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    visitKey: z.string().min(1).optional(),
    visitName: z.string().min(1).optional(),
    visitStatus: z.string().min(1).optional(),
});

export type opdVisitsFormValues = z.infer<typeof opdVisitsFormSchema>;

export const ipdAdmissionsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    admissionKey: z.string().min(1).optional(),
    admissionName: z.string().min(1).optional(),
    admissionStatus: z.string().min(1).optional(),
});

export type ipdAdmissionsFormValues = z.infer<typeof ipdAdmissionsFormSchema>;

export const clinicalNotesFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    noteKey: z.string().min(1).optional(),
    noteName: z.string().min(1).optional(),
    noteType: z.string().min(1).optional(),
});

export type clinicalNotesFormValues = z.infer<typeof clinicalNotesFormSchema>;

export const pharmacyInventoryFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    inventoryKey: z.string().min(1).optional(),
    inventoryName: z.string().min(1).optional(),
    inventoryType: z.string().min(1).optional(),
});

export type pharmacyInventoryFormValues = z.infer<typeof pharmacyInventoryFormSchema>;

export const prescriptionsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    prescriptionKey: z.string().min(1).optional(),
    prescriptionName: z.string().min(1).optional(),
    prescriptionStatus: z.string().min(1).optional(),
});

export type prescriptionsFormValues = z.infer<typeof prescriptionsFormSchema>;

export const labOrdersFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    orderKey: z.string().min(1).optional(),
    orderName: z.string().min(1).optional(),
    orderStatus: z.string().min(1).optional(),
});

export type labOrdersFormValues = z.infer<typeof labOrdersFormSchema>;

export const labResultsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    resultKey: z.string().min(1).optional(),
    resultName: z.string().min(1).optional(),
    resultStatus: z.string().min(1).optional(),
});

export type labResultsFormValues = z.infer<typeof labResultsFormSchema>;

export const hospitalBillingFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    billingKey: z.string().min(1).optional(),
    billingName: z.string().min(1).optional(),
    billingAmount: z.number().optional(),
});

export type hospitalBillingFormValues = z.infer<typeof hospitalBillingFormSchema>;

export const insuranceClaimsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    claimKey: z.string().min(1).optional(),
    claimName: z.string().min(1).optional(),
    claimStatus: z.string().min(1).optional(),
});

export type insuranceClaimsFormValues = z.infer<typeof insuranceClaimsFormSchema>;

export const hospitalInvoicesFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    invoiceKey: z.string().min(1).optional(),
    invoiceName: z.string().min(1).optional(),
    invoiceAmount: z.number().optional(),
});

export type hospitalInvoicesFormValues = z.infer<typeof hospitalInvoicesFormSchema>;

export const hospitalPaymentsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    paymentKey: z.string().min(1).optional(),
    paymentName: z.string().min(1).optional(),
    paymentAmount: z.number().optional(),
});

export type hospitalPaymentsFormValues = z.infer<typeof hospitalPaymentsFormSchema>;

export const patientNotificationsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    notificationKey: z.string().min(1).optional(),
    notificationTitle: z.string().min(1).optional(),
    notificationType: z.string().min(1).optional(),
});

export type patientNotificationsFormValues = z.infer<typeof patientNotificationsFormSchema>;

export const medicalReportsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    reportKey: z.string().min(1).optional(),
    reportName: z.string().min(1).optional(),
    reportType: z.string().min(1).optional(),
});

export type medicalReportsFormValues = z.infer<typeof medicalReportsFormSchema>;

export const patientFeedbackFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    feedbackKey: z.string().min(1).optional(),
    feedbackName: z.string().min(1).optional(),
    feedbackScore: z.number().optional(),
});

export type patientFeedbackFormValues = z.infer<typeof patientFeedbackFormSchema>;

export const patientRegistrationsAnalyticsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type patientRegistrationsAnalyticsFormValues = z.infer<typeof patientRegistrationsAnalyticsFormSchema>;

export const occupancyAnalyticsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type occupancyAnalyticsFormValues = z.infer<typeof occupancyAnalyticsFormSchema>;

export const revenueAnalyticsFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    analyticsKey: z.string().min(1).optional(),
    analyticsType: z.string().min(1).optional(),
    analyticsScore: z.number().optional(),
});

export type revenueAnalyticsFormValues = z.infer<typeof revenueAnalyticsFormSchema>;

export const hospitalMetricsFormSchema = z.object({
    metricsKey: z.string().min(1).optional(),
    patientRegistrationsCount: z.number().optional(),
    overallHospitalScore: z.number().optional(),
});

export type hospitalMetricsFormValues = z.infer<typeof hospitalMetricsFormSchema>;

export const hospitalHealthFormSchema = z.object({
    healthKey: z.string().min(1).optional(),
    overallScore: z.number().optional(),
    disasterRecoveryMode: z.boolean().optional(),
});

export type hospitalHealthFormValues = z.infer<typeof hospitalHealthFormSchema>;

export const executiveKpisFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    kpiKey: z.string().min(1).optional(),
    kpiName: z.string().min(1).optional(),
    kpiScore: z.number().optional(),
});

export type executiveKpisFormValues = z.infer<typeof executiveKpisFormSchema>;

export const hospitalFailuresFormSchema = z.object({
    hospitalHubId: z.string().min(1),
    failureKey: z.string().min(1).optional(),
    failureType: z.string().min(1).optional(),
});

export type hospitalFailuresFormValues = z.infer<typeof hospitalFailuresFormSchema>;
