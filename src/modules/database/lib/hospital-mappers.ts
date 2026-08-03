import type { DbHspHospitalHub,
    DbHspCampus,
    DbHspDepartment,
    DbHspWard,
    DbHspHospitalBed,
    DbHspPatientRegistration,
    DbHspPatientProfile,
    DbHspMedicalHistory,
    DbHspInsurancePolicy,
    DbHspAppointment,
    DbHspOpdVisit,
    DbHspIpdAdmission,
    DbHspClinicalNote,
    DbHspPharmacyInventory,
    DbHspPrescription,
    DbHspLabOrder,
    DbHspLabResult,
    DbHspHospitalBilling,
    DbHspInsuranceClaim,
    DbHspHospitalInvoice,
    DbHspHospitalPayment,
    DbHspPatientNotification,
    DbHspMedicalReport,
    DbHspPatientFeedback,
    DbHspAdmissionsAnalytics,
    DbHspOccupancyAnalytics,
    DbHspRevenueAnalytics,
    DbHspHospitalMetric,
    DbHspHospitalHealth,
    DbHspExecutiveKpi,
    DbHspHospitalFailure,
    DbHspAuditLog } from "@/src/modules/database/types/platform";
import type { CreateHospitalHubInput,
    HospitalHubSummary,
    CreateCampusInput,
    CampusSummary,
    CreateDepartmentInput,
    DepartmentSummary,
    CreateWardInput,
    WardSummary,
    CreateHospitalBedInput,
    HospitalBedSummary,
    CreatePatientRegistrationInput,
    PatientRegistrationSummary,
    CreatePatientProfileInput,
    PatientProfileSummary,
    CreateMedicalHistoryInput,
    MedicalHistorySummary,
    CreateInsurancePolicyInput,
    InsurancePolicySummary,
    CreateAppointmentInput,
    AppointmentSummary,
    CreateOpdVisitInput,
    OpdVisitSummary,
    CreateIpdAdmissionInput,
    IpdAdmissionSummary,
    CreateClinicalNoteInput,
    ClinicalNoteSummary,
    CreatePharmacyInventoryInput,
    PharmacyInventorySummary,
    CreatePrescriptionInput,
    PrescriptionSummary,
    CreateLabOrderInput,
    LabOrderSummary,
    CreateLabResultInput,
    LabResultSummary,
    CreateHospitalBillingInput,
    HospitalBillingSummary,
    CreateInsuranceClaimInput,
    InsuranceClaimSummary,
    CreateHospitalInvoiceInput,
    HospitalInvoiceSummary,
    CreateHospitalPaymentInput,
    HospitalPaymentSummary,
    CreatePatientNotificationInput,
    PatientNotificationSummary,
    CreateMedicalReportInput,
    MedicalReportSummary,
    CreatePatientFeedbackInput,
    PatientFeedbackSummary,
    CreateAdmissionsAnalyticsInput,
    AdmissionsAnalyticsSummary,
    CreateOccupancyAnalyticsInput,
    OccupancyAnalyticsSummary,
    CreateRevenueAnalyticsInput,
    RevenueAnalyticsSummary,
    CreateHospitalMetricInput,
    HospitalMetricSummary,
    CreateHospitalHealthInput,
    HospitalHealthSummary,
    CreateExecutiveKpiInput,
    ExecutiveKpiSummary,
    CreateHospitalFailureInput,
    HospitalFailureSummary,
    HspDashboardStats,
    HspPipelineInfo,
    AuditEntry } from "@/src/modules/hospital/types";

export function buildHospitalHubLookupMaps(hubs: DbHspHospitalHub[]) {
    const hubNameById = new Map(hubs.map((h) => [h.id, h.hub_name]));
    return { hubNameById };
}

export function buildHspPipelineInfo(): HspPipelineInfo {
    const stages = [
        { key: "foundation", label: "Foundation" },
        { key: "patient", label: "Patient" },
        { key: "clinical", label: "Clinical Operations" },
        { key: "pharmacy_lab", label: "Pharmacy & Lab" },
        { key: "finance", label: "Finance" },
    ];
    return { stages, currentStage: "clinical", nextStage: "pharmacy_lab", previousStage: "patient" };
}

export function buildHspAuditPayload(organizationId: string, entityType: string, action: string, summary: string, entityId?: string) {
    return { organization_id: organizationId, entity_type: entityType, action, summary, entity_id: entityId ?? null, metadata: {}, security_level: "standard" };
}

export function mapAuditEntry(record: DbHspAuditLog): AuditEntry {
    return { id: record.id, entityType: record.entity_type, entityId: record.entity_id, action: record.action, summary: record.summary, securityLevel: record.security_level, createdAt: record.created_at };
}

export function mapHospitalHubSummary(record: DbHspHospitalHub): HospitalHubSummary {
    return {
        id: record.id,
        hubKey: record.hub_key as string,
        hubName: record.hub_name as string,
        environment: record.environment as string,
        status: record.status,
    };
}

export function buildHospitalHubPayload(organizationId: string, input: CreateHospitalHubInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_key: input.hubKey ?? '',
        hub_name: input.hubName ?? '',
        environment: input.environment ?? '',
        status: "active",
    };
}

export function mapCampusSummary(record: DbHspCampus, maps?: { hubNameById: Map<string, string> }): CampusSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        campusKey: record.campus_key as string,
        campusName: record.campus_name as string,
        campusType: record.campus_type as string,
        status: record.status,
    };
}

export function buildCampusPayload(organizationId: string, input: CreateCampusInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        campus_key: input.campusKey ?? '',
        campus_name: input.campusName ?? '',
        campus_type: input.campusType ?? '',
        status: "active",
    };
}

export function mapDepartmentSummary(record: DbHspDepartment, maps?: { hubNameById: Map<string, string> }): DepartmentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        departmentKey: record.department_key as string,
        departmentName: record.department_name as string,
        departmentType: record.department_type as string,
        status: record.status,
    };
}

export function buildDepartmentPayload(organizationId: string, input: CreateDepartmentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        department_key: input.departmentKey ?? '',
        department_name: input.departmentName ?? '',
        department_type: input.departmentType ?? '',
        status: "active",
    };
}

export function mapWardSummary(record: DbHspWard, maps?: { hubNameById: Map<string, string> }): WardSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        wardKey: record.ward_key as string,
        wardName: record.ward_name as string,
        wardType: record.ward_type as string,
        status: record.status,
    };
}

export function buildWardPayload(organizationId: string, input: CreateWardInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        ward_key: input.wardKey ?? '',
        ward_name: input.wardName ?? '',
        ward_type: input.wardType ?? '',
        status: "active",
    };
}

export function mapHospitalBedSummary(record: DbHspHospitalBed, maps?: { hubNameById: Map<string, string> }): HospitalBedSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        bedKey: record.bed_key as string,
        bedNumber: record.bed_number as string,
        bedStatus: record.bed_status as string,
        status: record.status,
    };
}

export function buildHospitalBedPayload(organizationId: string, input: CreateHospitalBedInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        bed_key: input.bedKey ?? '',
        bed_number: input.bedNumber ?? '',
        bed_status: input.bedStatus ?? '',
        status: "active",
    };
}

export function mapPatientRegistrationSummary(record: DbHspPatientRegistration, maps?: { hubNameById: Map<string, string> }): PatientRegistrationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        registrationKey: record.registration_key as string,
        registrationName: record.registration_name as string,
        registrationStatus: record.registration_status as string,
        status: record.status,
    };
}

export function buildPatientRegistrationPayload(organizationId: string, input: CreatePatientRegistrationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        registration_key: input.registrationKey ?? '',
        registration_name: input.registrationName ?? '',
        registration_status: input.registrationStatus ?? '',
        status: "active",
    };
}

export function mapPatientProfileSummary(record: DbHspPatientProfile, maps?: { hubNameById: Map<string, string> }): PatientProfileSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        profileKey: record.profile_key as string,
        profileName: record.profile_name as string,
        profileType: record.profile_type as string,
        status: record.status,
    };
}

export function buildPatientProfilePayload(organizationId: string, input: CreatePatientProfileInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        profile_key: input.profileKey ?? '',
        profile_name: input.profileName ?? '',
        profile_type: input.profileType ?? '',
        status: "active",
    };
}

export function mapMedicalHistorySummary(record: DbHspMedicalHistory, maps?: { hubNameById: Map<string, string> }): MedicalHistorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        historyKey: record.history_key as string,
        historyName: record.history_name as string,
        historyType: record.history_type as string,
        status: record.status,
    };
}

export function buildMedicalHistoryPayload(organizationId: string, input: CreateMedicalHistoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        history_key: input.historyKey ?? '',
        history_name: input.historyName ?? '',
        history_type: input.historyType ?? '',
        status: "active",
    };
}

export function mapInsurancePolicySummary(record: DbHspInsurancePolicy, maps?: { hubNameById: Map<string, string> }): InsurancePolicySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        policyKey: record.policy_key as string,
        policyName: record.policy_name as string,
        policyType: record.policy_type as string,
        status: record.status,
    };
}

export function buildInsurancePolicyPayload(organizationId: string, input: CreateInsurancePolicyInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        policy_key: input.policyKey ?? '',
        policy_name: input.policyName ?? '',
        policy_type: input.policyType ?? '',
        status: "active",
    };
}

export function mapAppointmentSummary(record: DbHspAppointment, maps?: { hubNameById: Map<string, string> }): AppointmentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        appointmentKey: record.appointment_key as string,
        appointmentName: record.appointment_name as string,
        appointmentStatus: record.appointment_status as string,
        status: record.status,
    };
}

export function buildAppointmentPayload(organizationId: string, input: CreateAppointmentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        appointment_key: input.appointmentKey ?? '',
        appointment_name: input.appointmentName ?? '',
        appointment_status: input.appointmentStatus ?? '',
        status: "active",
    };
}

export function mapOpdVisitSummary(record: DbHspOpdVisit, maps?: { hubNameById: Map<string, string> }): OpdVisitSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        visitKey: record.visit_key as string,
        visitName: record.visit_name as string,
        visitStatus: record.visit_status as string,
        status: record.status,
    };
}

export function buildOpdVisitPayload(organizationId: string, input: CreateOpdVisitInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        visit_key: input.visitKey ?? '',
        visit_name: input.visitName ?? '',
        visit_status: input.visitStatus ?? '',
        status: "active",
    };
}

export function mapIpdAdmissionSummary(record: DbHspIpdAdmission, maps?: { hubNameById: Map<string, string> }): IpdAdmissionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        admissionKey: record.admission_key as string,
        admissionName: record.admission_name as string,
        admissionStatus: record.admission_status as string,
        status: record.status,
    };
}

export function buildIpdAdmissionPayload(organizationId: string, input: CreateIpdAdmissionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        admission_key: input.admissionKey ?? '',
        admission_name: input.admissionName ?? '',
        admission_status: input.admissionStatus ?? '',
        status: "active",
    };
}

export function mapClinicalNoteSummary(record: DbHspClinicalNote, maps?: { hubNameById: Map<string, string> }): ClinicalNoteSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        noteKey: record.note_key as string,
        noteName: record.note_name as string,
        noteType: record.note_type as string,
        status: record.status,
    };
}

export function buildClinicalNotePayload(organizationId: string, input: CreateClinicalNoteInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        note_key: input.noteKey ?? '',
        note_name: input.noteName ?? '',
        note_type: input.noteType ?? '',
        status: "active",
    };
}

export function mapPharmacyInventorySummary(record: DbHspPharmacyInventory, maps?: { hubNameById: Map<string, string> }): PharmacyInventorySummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        inventoryKey: record.inventory_key as string,
        inventoryName: record.inventory_name as string,
        inventoryType: record.inventory_type as string,
        status: record.status,
    };
}

export function buildPharmacyInventoryPayload(organizationId: string, input: CreatePharmacyInventoryInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        inventory_key: input.inventoryKey ?? '',
        inventory_name: input.inventoryName ?? '',
        inventory_type: input.inventoryType ?? '',
        status: "active",
    };
}

export function mapPrescriptionSummary(record: DbHspPrescription, maps?: { hubNameById: Map<string, string> }): PrescriptionSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        prescriptionKey: record.prescription_key as string,
        prescriptionName: record.prescription_name as string,
        prescriptionStatus: record.prescription_status as string,
        status: record.status,
    };
}

export function buildPrescriptionPayload(organizationId: string, input: CreatePrescriptionInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        prescription_key: input.prescriptionKey ?? '',
        prescription_name: input.prescriptionName ?? '',
        prescription_status: input.prescriptionStatus ?? '',
        status: "active",
    };
}

export function mapLabOrderSummary(record: DbHspLabOrder, maps?: { hubNameById: Map<string, string> }): LabOrderSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        orderKey: record.order_key as string,
        orderName: record.order_name as string,
        orderStatus: record.order_status as string,
        status: record.status,
    };
}

export function buildLabOrderPayload(organizationId: string, input: CreateLabOrderInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        order_key: input.orderKey ?? '',
        order_name: input.orderName ?? '',
        order_status: input.orderStatus ?? '',
        status: "active",
    };
}

export function mapLabResultSummary(record: DbHspLabResult, maps?: { hubNameById: Map<string, string> }): LabResultSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        resultKey: record.result_key as string,
        resultName: record.result_name as string,
        resultStatus: record.result_status as string,
        status: record.status,
    };
}

export function buildLabResultPayload(organizationId: string, input: CreateLabResultInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        result_key: input.resultKey ?? '',
        result_name: input.resultName ?? '',
        result_status: input.resultStatus ?? '',
        status: "active",
    };
}

export function mapHospitalBillingSummary(record: DbHspHospitalBilling, maps?: { hubNameById: Map<string, string> }): HospitalBillingSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        billingKey: record.billing_key as string,
        billingName: record.billing_name as string,
        billingAmount: record.billing_amount as number,
        status: record.status,
    };
}

export function buildHospitalBillingPayload(organizationId: string, input: CreateHospitalBillingInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        billing_key: input.billingKey ?? '',
        billing_name: input.billingName ?? '',
        billing_amount: input.billingAmount ?? 0,
        status: "active",
    };
}

export function mapInsuranceClaimSummary(record: DbHspInsuranceClaim, maps?: { hubNameById: Map<string, string> }): InsuranceClaimSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        claimKey: record.claim_key as string,
        claimName: record.claim_name as string,
        claimStatus: record.claim_status as string,
        status: record.status,
    };
}

export function buildInsuranceClaimPayload(organizationId: string, input: CreateInsuranceClaimInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        claim_key: input.claimKey ?? '',
        claim_name: input.claimName ?? '',
        claim_status: input.claimStatus ?? '',
        status: "active",
    };
}

export function mapHospitalInvoiceSummary(record: DbHspHospitalInvoice, maps?: { hubNameById: Map<string, string> }): HospitalInvoiceSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        invoiceKey: record.invoice_key as string,
        invoiceName: record.invoice_name as string,
        invoiceAmount: record.invoice_amount as number,
        status: record.status,
    };
}

export function buildHospitalInvoicePayload(organizationId: string, input: CreateHospitalInvoiceInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        invoice_key: input.invoiceKey ?? '',
        invoice_name: input.invoiceName ?? '',
        invoice_amount: input.invoiceAmount ?? 0,
        status: "active",
    };
}

export function mapHospitalPaymentSummary(record: DbHspHospitalPayment, maps?: { hubNameById: Map<string, string> }): HospitalPaymentSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        paymentKey: record.payment_key as string,
        paymentName: record.payment_name as string,
        paymentAmount: record.payment_amount as number,
        status: record.status,
    };
}

export function buildHospitalPaymentPayload(organizationId: string, input: CreateHospitalPaymentInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        payment_key: input.paymentKey ?? '',
        payment_name: input.paymentName ?? '',
        payment_amount: input.paymentAmount ?? 0,
        status: "active",
    };
}

export function mapPatientNotificationSummary(record: DbHspPatientNotification, maps?: { hubNameById: Map<string, string> }): PatientNotificationSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        notificationKey: record.notification_key as string,
        notificationTitle: record.notification_title as string,
        notificationType: record.notification_type as string,
        status: record.status,
    };
}

export function buildPatientNotificationPayload(organizationId: string, input: CreatePatientNotificationInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        notification_key: input.notificationKey ?? '',
        notification_title: input.notificationTitle ?? '',
        notification_type: input.notificationType ?? '',
        status: "active",
    };
}

export function mapMedicalReportSummary(record: DbHspMedicalReport, maps?: { hubNameById: Map<string, string> }): MedicalReportSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        reportKey: record.report_key as string,
        reportName: record.report_name as string,
        reportType: record.report_type as string,
        status: record.status,
    };
}

export function buildMedicalReportPayload(organizationId: string, input: CreateMedicalReportInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        report_key: input.reportKey ?? '',
        report_name: input.reportName ?? '',
        report_type: input.reportType ?? '',
        status: "active",
    };
}

export function mapPatientFeedbackSummary(record: DbHspPatientFeedback, maps?: { hubNameById: Map<string, string> }): PatientFeedbackSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        feedbackKey: record.feedback_key as string,
        feedbackName: record.feedback_name as string,
        feedbackScore: record.feedback_score as number,
        status: record.status,
    };
}

export function buildPatientFeedbackPayload(organizationId: string, input: CreatePatientFeedbackInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        feedback_key: input.feedbackKey ?? '',
        feedback_name: input.feedbackName ?? '',
        feedback_score: input.feedbackScore ?? 0,
        status: "active",
    };
}

export function mapAdmissionsAnalyticsSummary(record: DbHspAdmissionsAnalytics, maps?: { hubNameById: Map<string, string> }): AdmissionsAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildAdmissionsAnalyticsPayload(organizationId: string, input: CreateAdmissionsAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapOccupancyAnalyticsSummary(record: DbHspOccupancyAnalytics, maps?: { hubNameById: Map<string, string> }): OccupancyAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildOccupancyAnalyticsPayload(organizationId: string, input: CreateOccupancyAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapRevenueAnalyticsSummary(record: DbHspRevenueAnalytics, maps?: { hubNameById: Map<string, string> }): RevenueAnalyticsSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        analyticsKey: record.analytics_key as string,
        analyticsType: record.analytics_type as string,
        analyticsScore: record.analytics_score as number,
        status: record.status,
    };
}

export function buildRevenueAnalyticsPayload(organizationId: string, input: CreateRevenueAnalyticsInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        analytics_key: input.analyticsKey ?? '',
        analytics_type: input.analyticsType ?? '',
        analytics_score: input.analyticsScore ?? 0,
        status: "active",
    };
}

export function mapHospitalMetricSummary(record: DbHspHospitalMetric): HospitalMetricSummary {
    return {
        id: record.id,
        metricsKey: record.metrics_key as string,
        admissionsCount: record.admissions_count as number,
        overallHospitalScore: record.overall_hospital_score as number,
        status: record.status,
    };
}

export function buildHospitalMetricPayload(organizationId: string, input: CreateHospitalMetricInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        metrics_key: input.metricsKey ?? '',
        admissions_count: input.admissionsCount ?? 0,
        overall_hospital_score: input.overallHospitalScore ?? 0,
        status: "active",
    };
}

export function mapHospitalHealthSummary(record: DbHspHospitalHealth): HospitalHealthSummary {
    return {
        id: record.id,
        healthKey: record.health_key as string,
        overallScore: record.overall_score as number,
        disasterRecoveryMode: record.disaster_recovery_mode as boolean,
        status: record.status,
    };
}

export function buildHospitalHealthPayload(organizationId: string, input: CreateHospitalHealthInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        health_key: input.healthKey ?? '',
        overall_score: input.overallScore ?? 0,
        disaster_recovery_mode: input.disasterRecoveryMode ?? false,
        status: "active",
    };
}

export function mapExecutiveKpiSummary(record: DbHspExecutiveKpi, maps?: { hubNameById: Map<string, string> }): ExecutiveKpiSummary {
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
        hub_id: input.hospitalHubId,
        kpi_key: input.kpiKey ?? '',
        kpi_name: input.kpiName ?? '',
        kpi_score: input.kpiScore ?? 0,
        status: "active",
    };
}

export function mapHospitalFailureSummary(record: DbHspHospitalFailure, maps?: { hubNameById: Map<string, string> }): HospitalFailureSummary {
    return {
        id: record.id,
        hubName: maps?.hubNameById.get(record.hub_id ?? "") ?? undefined,
        failureKey: record.failure_key as string,
        failureType: record.failure_type as string,
        status: record.status,
    };
}

export function buildHospitalFailurePayload(organizationId: string, input: CreateHospitalFailureInput): Record<string, unknown> {
    return {
        organization_id: organizationId,
        hub_id: input.hospitalHubId,
        failure_key: input.failureKey ?? '',
        failure_type: input.failureType ?? '',
        status: "active",
    };
}

export function mapCampusForStats(r: DbHspCampus) { return { status: r.status }; }
export function mapPatientRegistrationForStats(r: DbHspPatientRegistration) { return { status: r.status }; }
export function mapHospitalMetricForStats(r: DbHspHospitalMetric) {
    return {
        admissions_count: r.admissions_count,
        discharge_count: r.discharge_count,
        bed_occupancy_rate: r.bed_occupancy_rate,
        revenue_total: r.revenue_total,
        department_performance_score: r.department_performance_score,
        patient_satisfaction_score: r.patient_satisfaction_score,
        operational_health_score: r.operational_health_score,
        overall_hospital_score: r.overall_hospital_score,
        status: r.status,
    };
}
export function mapAppointmentForStats(r: DbHspAppointment) { return { appointment_status: r.appointment_status, status: r.status }; }
export function mapHospitalInvoiceForStats(r: DbHspHospitalInvoice) { return { status: r.status }; }
export function mapPharmacyInventoryForStats(r: DbHspPharmacyInventory) { return { status: r.status }; }
export function mapHospitalHealthForStats(r: DbHspHospitalHealth) { return { overall_score: r.overall_score, status: r.status }; }
export function mapHospitalFailureForStats(r: DbHspHospitalFailure) { return { status: r.status }; }

export function buildHspDashboardStats(input: {
    hospitalHubs: HospitalHubSummary[];
    campuses: ReturnType<typeof mapCampusForStats>[];
    patientRegistrations: ReturnType<typeof mapPatientRegistrationForStats>[];
    hospitalMetrics: ReturnType<typeof mapHospitalMetricForStats>[];
    appointments: ReturnType<typeof mapAppointmentForStats>[];
    hospitalInvoices: ReturnType<typeof mapHospitalInvoiceForStats>[];
    pharmacyInventory: ReturnType<typeof mapPharmacyInventoryForStats>[];
    hospitalHealth: ReturnType<typeof mapHospitalHealthForStats>[];
    hospitalFailures: HospitalFailureSummary[];
    auditLogs: AuditEntry[];
}): HspDashboardStats {
    const activeHubs = input.hospitalHubs.filter((h) => h.status === "active").length;
    const latestMetrics = input.hospitalMetrics[0];
    const latestHealth = input.hospitalHealth[0];
    return {
        totalHospitalHubs: input.hospitalHubs.length,
        activeHospitalHubs: activeHubs,
        campusCount: input.campuses.length,
        patientRegistrationCount: input.patientRegistrations.length,
        appointmentCount: input.appointments.length,
        openHospitalInvoiceCount: input.hospitalInvoices.filter((r) => r.status === "open" || r.status === "pending").length,
        openFailureCount: input.hospitalFailures.filter((f) => f.status === "open" || f.status === "failed").length,
        overallHospitalScore: latestMetrics?.overall_hospital_score ?? latestHealth?.overall_score ?? 0,
        admissionsCountScore: latestMetrics?.admissions_count ?? 0,
        revenueTotalScore: latestMetrics?.revenue_total ?? 0,
        bedOccupancyRateScore: latestMetrics?.bed_occupancy_rate ?? 0,
        departmentPerformanceScore: latestMetrics?.department_performance_score ?? 0,
        patientSatisfactionScore: latestMetrics?.patient_satisfaction_score ?? 0,
        auditCount: input.auditLogs.length,
    };
}
