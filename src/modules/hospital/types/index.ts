export interface HspDashboardStats {
    totalHospitalHubs: number;
    activeHospitalHubs: number;
    campusCount: number;
    patientRegistrationCount: number;
    appointmentCount: number;
    openHospitalInvoiceCount: number;
    openFailureCount: number;
    overallHospitalScore: number;
    admissionsCountScore: number;
    revenueTotalScore: number;
    bedOccupancyRateScore: number;
    departmentPerformanceScore: number;
    patientSatisfactionScore: number;
    auditCount: number;
}

export interface HspPipelineInfo {
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

export interface HspSdkRegisterCampusInput { hospitalHubId: string; campusKey?: string; campusName?: string; }
export interface HspSdkRegisterCampusResult { campusId: string; campusKey: string; status: string; }
export interface HspSdkConfigurePatientRegistrationInput { hospitalHubId: string; registrationKey?: string; registrationName?: string; }
export interface HspSdkConfigurePatientRegistrationResult { registrationId: string; registrationKey: string; status: string; }
export interface HspSdkRunAppointmentWorkflowInput { hospitalHubId: string; appointmentKey?: string; appointmentName?: string; }
export interface HspSdkRunAppointmentWorkflowResult { appointmentId: string; appointmentKey: string; status: string; }

export interface HospitalHubSummary {
    id: string;
        hubKey: string;
    hubName: string;
    environment: string;
    status: string;
}

export interface CreateHospitalHubInput {
        hubKey?: string;
    hubName?: string;
    environment?: string;
}

export interface CampusSummary {
    id: string;
    hubName?: string;
        campusKey: string;
    campusName: string;
    campusType: string;
    status: string;
}

export interface CreateCampusInput {
        hospitalHubId: string;
        campusKey?: string;
    campusName?: string;
    campusType?: string;
}

export interface DepartmentSummary {
    id: string;
    hubName?: string;
        departmentKey: string;
    departmentName: string;
    departmentType: string;
    status: string;
}

export interface CreateDepartmentInput {
        hospitalHubId: string;
        departmentKey?: string;
    departmentName?: string;
    departmentType?: string;
}

export interface WardSummary {
    id: string;
    hubName?: string;
        wardKey: string;
    wardName: string;
    wardType: string;
    status: string;
}

export interface CreateWardInput {
        hospitalHubId: string;
        wardKey?: string;
    wardName?: string;
    wardType?: string;
}

export interface HospitalBedSummary {
    id: string;
    hubName?: string;
        bedKey: string;
    bedNumber: string;
    bedStatus: string;
    status: string;
}

export interface CreateHospitalBedInput {
        hospitalHubId: string;
        bedKey?: string;
    bedNumber?: string;
    bedStatus?: string;
}

export interface PatientRegistrationSummary {
    id: string;
    hubName?: string;
        registrationKey: string;
    registrationName: string;
    registrationStatus: string;
    status: string;
}

export interface CreatePatientRegistrationInput {
        hospitalHubId: string;
        registrationKey?: string;
    registrationName?: string;
    registrationStatus?: string;
}

export interface PatientProfileSummary {
    id: string;
    hubName?: string;
        profileKey: string;
    profileName: string;
    profileType: string;
    status: string;
}

export interface CreatePatientProfileInput {
        hospitalHubId: string;
        profileKey?: string;
    profileName?: string;
    profileType?: string;
}

export interface MedicalHistorySummary {
    id: string;
    hubName?: string;
        historyKey: string;
    historyName: string;
    historyType: string;
    status: string;
}

export interface CreateMedicalHistoryInput {
        hospitalHubId: string;
        historyKey?: string;
    historyName?: string;
    historyType?: string;
}

export interface InsurancePolicySummary {
    id: string;
    hubName?: string;
        policyKey: string;
    policyName: string;
    policyType: string;
    status: string;
}

export interface CreateInsurancePolicyInput {
        hospitalHubId: string;
        policyKey?: string;
    policyName?: string;
    policyType?: string;
}

export interface AppointmentSummary {
    id: string;
    hubName?: string;
        appointmentKey: string;
    appointmentName: string;
    appointmentStatus: string;
    status: string;
}

export interface CreateAppointmentInput {
        hospitalHubId: string;
        appointmentKey?: string;
    appointmentName?: string;
    appointmentStatus?: string;
}

export interface OpdVisitSummary {
    id: string;
    hubName?: string;
        visitKey: string;
    visitName: string;
    visitStatus: string;
    status: string;
}

export interface CreateOpdVisitInput {
        hospitalHubId: string;
        visitKey?: string;
    visitName?: string;
    visitStatus?: string;
}

export interface IpdAdmissionSummary {
    id: string;
    hubName?: string;
        admissionKey: string;
    admissionName: string;
    admissionStatus: string;
    status: string;
}

export interface CreateIpdAdmissionInput {
        hospitalHubId: string;
        admissionKey?: string;
    admissionName?: string;
    admissionStatus?: string;
}

export interface ClinicalNoteSummary {
    id: string;
    hubName?: string;
        noteKey: string;
    noteName: string;
    noteType: string;
    status: string;
}

export interface CreateClinicalNoteInput {
        hospitalHubId: string;
        noteKey?: string;
    noteName?: string;
    noteType?: string;
}

export interface PharmacyInventorySummary {
    id: string;
    hubName?: string;
        inventoryKey: string;
    inventoryName: string;
    inventoryType: string;
    status: string;
}

export interface CreatePharmacyInventoryInput {
        hospitalHubId: string;
        inventoryKey?: string;
    inventoryName?: string;
    inventoryType?: string;
}

export interface PrescriptionSummary {
    id: string;
    hubName?: string;
        prescriptionKey: string;
    prescriptionName: string;
    prescriptionStatus: string;
    status: string;
}

export interface CreatePrescriptionInput {
        hospitalHubId: string;
        prescriptionKey?: string;
    prescriptionName?: string;
    prescriptionStatus?: string;
}

export interface LabOrderSummary {
    id: string;
    hubName?: string;
        orderKey: string;
    orderName: string;
    orderStatus: string;
    status: string;
}

export interface CreateLabOrderInput {
        hospitalHubId: string;
        orderKey?: string;
    orderName?: string;
    orderStatus?: string;
}

export interface LabResultSummary {
    id: string;
    hubName?: string;
        resultKey: string;
    resultName: string;
    resultStatus: string;
    status: string;
}

export interface CreateLabResultInput {
        hospitalHubId: string;
        resultKey?: string;
    resultName?: string;
    resultStatus?: string;
}

export interface HospitalBillingSummary {
    id: string;
    hubName?: string;
        billingKey: string;
    billingName: string;
    billingAmount: number;
    status: string;
}

export interface CreateHospitalBillingInput {
        hospitalHubId: string;
        billingKey?: string;
    billingName?: string;
    billingAmount?: number;
}

export interface InsuranceClaimSummary {
    id: string;
    hubName?: string;
        claimKey: string;
    claimName: string;
    claimStatus: string;
    status: string;
}

export interface CreateInsuranceClaimInput {
        hospitalHubId: string;
        claimKey?: string;
    claimName?: string;
    claimStatus?: string;
}

export interface HospitalInvoiceSummary {
    id: string;
    hubName?: string;
        invoiceKey: string;
    invoiceName: string;
    invoiceAmount: number;
    status: string;
}

export interface CreateHospitalInvoiceInput {
        hospitalHubId: string;
        invoiceKey?: string;
    invoiceName?: string;
    invoiceAmount?: number;
}

export interface HospitalPaymentSummary {
    id: string;
    hubName?: string;
        paymentKey: string;
    paymentName: string;
    paymentAmount: number;
    status: string;
}

export interface CreateHospitalPaymentInput {
        hospitalHubId: string;
        paymentKey?: string;
    paymentName?: string;
    paymentAmount?: number;
}

export interface PatientNotificationSummary {
    id: string;
    hubName?: string;
        notificationKey: string;
    notificationTitle: string;
    notificationType: string;
    status: string;
}

export interface CreatePatientNotificationInput {
        hospitalHubId: string;
        notificationKey?: string;
    notificationTitle?: string;
    notificationType?: string;
}

export interface MedicalReportSummary {
    id: string;
    hubName?: string;
        reportKey: string;
    reportName: string;
    reportType: string;
    status: string;
}

export interface CreateMedicalReportInput {
        hospitalHubId: string;
        reportKey?: string;
    reportName?: string;
    reportType?: string;
}

export interface PatientFeedbackSummary {
    id: string;
    hubName?: string;
        feedbackKey: string;
    feedbackName: string;
    feedbackScore: number;
    status: string;
}

export interface CreatePatientFeedbackInput {
        hospitalHubId: string;
        feedbackKey?: string;
    feedbackName?: string;
    feedbackScore?: number;
}

export interface AdmissionsAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateAdmissionsAnalyticsInput {
        hospitalHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface OccupancyAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateOccupancyAnalyticsInput {
        hospitalHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface RevenueAnalyticsSummary {
    id: string;
    hubName?: string;
        analyticsKey: string;
    analyticsType: string;
    analyticsScore: number;
    status: string;
}

export interface CreateRevenueAnalyticsInput {
        hospitalHubId: string;
        analyticsKey?: string;
    analyticsType?: string;
    analyticsScore?: number;
}

export interface HospitalMetricSummary {
    id: string;
    hubName?: string;
        metricsKey: string;
    admissionsCount: number;
    overallHospitalScore: number;
    status: string;
}

export interface CreateHospitalMetricInput {
        metricsKey?: string;
    admissionsCount?: number;
    overallHospitalScore?: number;
}

export interface HospitalHealthSummary {
    id: string;
    hubName?: string;
        healthKey: string;
    overallScore: number;
    disasterRecoveryMode: boolean;
    status: string;
}

export interface CreateHospitalHealthInput {
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
        hospitalHubId: string;
        kpiKey?: string;
    kpiName?: string;
    kpiScore?: number;
}

export interface HospitalFailureSummary {
    id: string;
    hubName?: string;
        failureKey: string;
    failureType: string;
    status: string;
}

export interface CreateHospitalFailureInput {
        hospitalHubId: string;
        failureKey?: string;
    failureType?: string;
}

