"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { hospitalService } from "@/src/modules/hospital/services/hospital.service";
import type {
    HospitalHubSummary,
    CreateHospitalHubInput,
    CampusSummary,
    CreateCampusInput,
    DepartmentSummary,
    CreateDepartmentInput,
    WardSummary,
    CreateWardInput,
    HospitalBedSummary,
    CreateHospitalBedInput,
    PatientRegistrationSummary,
    CreatePatientRegistrationInput,
    PatientProfileSummary,
    CreatePatientProfileInput,
    MedicalHistorySummary,
    CreateMedicalHistoryInput,
    InsurancePolicySummary,
    CreateInsurancePolicyInput,
    AppointmentSummary,
    CreateAppointmentInput,
    OpdVisitSummary,
    CreateOpdVisitInput,
    IpdAdmissionSummary,
    CreateIpdAdmissionInput,
    ClinicalNoteSummary,
    CreateClinicalNoteInput,
    PharmacyInventorySummary,
    CreatePharmacyInventoryInput,
    PrescriptionSummary,
    CreatePrescriptionInput,
    LabOrderSummary,
    CreateLabOrderInput,
    LabResultSummary,
    CreateLabResultInput,
    HospitalBillingSummary,
    CreateHospitalBillingInput,
    InsuranceClaimSummary,
    CreateInsuranceClaimInput,
    HospitalInvoiceSummary,
    CreateHospitalInvoiceInput,
    HospitalPaymentSummary,
    CreateHospitalPaymentInput,
    PatientNotificationSummary,
    CreatePatientNotificationInput,
    MedicalReportSummary,
    CreateMedicalReportInput,
    PatientFeedbackSummary,
    CreatePatientFeedbackInput,
    AdmissionsAnalyticsSummary,
    CreateAdmissionsAnalyticsInput,
    OccupancyAnalyticsSummary,
    CreateOccupancyAnalyticsInput,
    RevenueAnalyticsSummary,
    CreateRevenueAnalyticsInput,
    HospitalMetricSummary,
    CreateHospitalMetricInput,
    HospitalHealthSummary,
    CreateHospitalHealthInput,
    ExecutiveKpiSummary,
    CreateExecutiveKpiInput,
    HospitalFailureSummary,
    CreateHospitalFailureInput,
    AuditEntry,
    HspDashboardStats,
    HspPipelineInfo,
} from "@/src/modules/hospital/types";

export function useHospital() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<HspDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<HspPipelineInfo | null>(null);
    const [hospitalHubs, setHospitalHubs] = useState<HospitalHubSummary[]>([]);
    const [campuses, setCampuss] = useState<CampusSummary[]>([]);
    const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
    const [wards, setWards] = useState<WardSummary[]>([]);
    const [hospitalBeds, setHospitalBeds] = useState<HospitalBedSummary[]>([]);
    const [patientRegistrations, setPatientRegistrations] = useState<PatientRegistrationSummary[]>([]);
    const [patientProfiles, setPatientProfiles] = useState<PatientProfileSummary[]>([]);
    const [medicalHistories, setMedicalHistorys] = useState<MedicalHistorySummary[]>([]);
    const [insurancePolicies, setInsurancePolicys] = useState<InsurancePolicySummary[]>([]);
    const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
    const [opdVisits, setOpdVisits] = useState<OpdVisitSummary[]>([]);
    const [ipdAdmissions, setIpdAdmissions] = useState<IpdAdmissionSummary[]>([]);
    const [clinicalNotes, setClinicalNotes] = useState<ClinicalNoteSummary[]>([]);
    const [pharmacyInventory, setPharmacyInventorys] = useState<PharmacyInventorySummary[]>([]);
    const [prescriptions, setPrescriptions] = useState<PrescriptionSummary[]>([]);
    const [labOrders, setLabOrders] = useState<LabOrderSummary[]>([]);
    const [labResults, setLabResults] = useState<LabResultSummary[]>([]);
    const [hospitalBilling, setHospitalBillings] = useState<HospitalBillingSummary[]>([]);
    const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaimSummary[]>([]);
    const [hospitalInvoices, setHospitalInvoices] = useState<HospitalInvoiceSummary[]>([]);
    const [hospitalPayments, setHospitalPayments] = useState<HospitalPaymentSummary[]>([]);
    const [patientNotifications, setPatientNotifications] = useState<PatientNotificationSummary[]>([]);
    const [medicalReports, setMedicalReports] = useState<MedicalReportSummary[]>([]);
    const [patientFeedback, setPatientFeedbacks] = useState<PatientFeedbackSummary[]>([]);
    const [patientRegistrationsAnalytics, setAdmissionsAnalyticss] = useState<AdmissionsAnalyticsSummary[]>([]);
    const [occupancyAnalytics, setOccupancyAnalyticss] = useState<OccupancyAnalyticsSummary[]>([]);
    const [revenueAnalytics, setRevenueAnalyticss] = useState<RevenueAnalyticsSummary[]>([]);
    const [hospitalMetrics, setHospitalMetrics] = useState<HospitalMetricSummary[]>([]);
    const [hospitalHealth, setHospitalHealths] = useState<HospitalHealthSummary[]>([]);
    const [executiveKpis, setExecutiveKpis] = useState<ExecutiveKpiSummary[]>([]);
    const [hospitalFailures, setHospitalFailures] = useState<HospitalFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [hospitalHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
hospitalHubsList,
            campusesList,
            departmentsList,
            wardsList,
            hospitalBedsList,
            patientRegistrationsList,
            patientProfilesList,
            medicalHistoriesList,
            insurancePoliciesList,
            appointmentsList,
            opdVisitsList,
            ipdAdmissionsList,
            clinicalNotesList,
            pharmacyInventoryList,
            prescriptionsList,
            labOrdersList,
            labResultsList,
            hospitalBillingList,
            insuranceClaimsList,
            hospitalInvoicesList,
            hospitalPaymentsList,
            patientNotificationsList,
            medicalReportsList,
            patientFeedbackList,
            patientRegistrationsAnalyticsList,
            occupancyAnalyticsList,
            revenueAnalyticsList,
            hospitalMetricsList,
            hospitalHealthList,
            executiveKpisList,
            hospitalFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            hospitalService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(hospitalService.getPipelineInfo()),
            hospitalService.getHospitalHubs(authUserId, email, fullName),
            hospitalService.getCampuss(authUserId, email, fullName),
            hospitalService.getDepartments(authUserId, email, fullName),
            hospitalService.getWards(authUserId, email, fullName),
            hospitalService.getHospitalBeds(authUserId, email, fullName),
            hospitalService.getPatientRegistrations(authUserId, email, fullName),
            hospitalService.getPatientProfiles(authUserId, email, fullName),
            hospitalService.getMedicalHistorys(authUserId, email, fullName),
            hospitalService.getInsurancePolicys(authUserId, email, fullName),
            hospitalService.getAppointments(authUserId, email, fullName),
            hospitalService.getOpdVisits(authUserId, email, fullName),
            hospitalService.getIpdAdmissions(authUserId, email, fullName),
            hospitalService.getClinicalNotes(authUserId, email, fullName),
            hospitalService.getPharmacyInventorys(authUserId, email, fullName),
            hospitalService.getPrescriptions(authUserId, email, fullName),
            hospitalService.getLabOrders(authUserId, email, fullName),
            hospitalService.getLabResults(authUserId, email, fullName),
            hospitalService.getHospitalBillings(authUserId, email, fullName),
            hospitalService.getInsuranceClaims(authUserId, email, fullName),
            hospitalService.getHospitalInvoices(authUserId, email, fullName),
            hospitalService.getHospitalPayments(authUserId, email, fullName),
            hospitalService.getPatientNotifications(authUserId, email, fullName),
            hospitalService.getMedicalReports(authUserId, email, fullName),
            hospitalService.getPatientFeedbacks(authUserId, email, fullName),
            hospitalService.getAdmissionsAnalyticss(authUserId, email, fullName),
            hospitalService.getOccupancyAnalyticss(authUserId, email, fullName),
            hospitalService.getRevenueAnalyticss(authUserId, email, fullName),
            hospitalService.getHospitalMetrics(authUserId, email, fullName),
            hospitalService.getHospitalHealths(authUserId, email, fullName),
            hospitalService.getExecutiveKpis(authUserId, email, fullName),
            hospitalService.getHospitalFailures(authUserId, email, fullName),
            hospitalService.getAuditLogs(authUserId, email, fullName),
            hospitalService.getHospitalHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
hospitalHubsList,
            campusesList,
            departmentsList,
            wardsList,
            hospitalBedsList,
            patientRegistrationsList,
            patientProfilesList,
            medicalHistoriesList,
            insurancePoliciesList,
            appointmentsList,
            opdVisitsList,
            ipdAdmissionsList,
            clinicalNotesList,
            pharmacyInventoryList,
            prescriptionsList,
            labOrdersList,
            labResultsList,
            hospitalBillingList,
            insuranceClaimsList,
            hospitalInvoicesList,
            hospitalPaymentsList,
            patientNotificationsList,
            medicalReportsList,
            patientFeedbackList,
            patientRegistrationsAnalyticsList,
            occupancyAnalyticsList,
            revenueAnalyticsList,
            hospitalMetricsList,
            hospitalHealthList,
            executiveKpisList,
            hospitalFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setHospitalHubs(result.hospitalHubsList);
        setCampuss(result.campusesList);
        setDepartments(result.departmentsList);
        setWards(result.wardsList);
        setHospitalBeds(result.hospitalBedsList);
        setPatientRegistrations(result.patientRegistrationsList);
        setPatientProfiles(result.patientProfilesList);
        setMedicalHistorys(result.medicalHistoriesList);
        setInsurancePolicys(result.insurancePoliciesList);
        setAppointments(result.appointmentsList);
        setOpdVisits(result.opdVisitsList);
        setIpdAdmissions(result.ipdAdmissionsList);
        setClinicalNotes(result.clinicalNotesList);
        setPharmacyInventorys(result.pharmacyInventoryList);
        setPrescriptions(result.prescriptionsList);
        setLabOrders(result.labOrdersList);
        setLabResults(result.labResultsList);
        setHospitalBillings(result.hospitalBillingList);
        setInsuranceClaims(result.insuranceClaimsList);
        setHospitalInvoices(result.hospitalInvoicesList);
        setHospitalPayments(result.hospitalPaymentsList);
        setPatientNotifications(result.patientNotificationsList);
        setMedicalReports(result.medicalReportsList);
        setPatientFeedbacks(result.patientFeedbackList);
        setAdmissionsAnalyticss(result.patientRegistrationsAnalyticsList);
        setOccupancyAnalyticss(result.occupancyAnalyticsList);
        setRevenueAnalyticss(result.revenueAnalyticsList);
        setHospitalMetrics(result.hospitalMetricsList);
        setHospitalHealths(result.hospitalHealthList);
        setExecutiveKpis(result.executiveKpisList);
        setHospitalFailures(result.hospitalFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createHospitalHub = useCallback(async (input: CreateHospitalHubInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createHospitalHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCampus = useCallback(async (input: CreateCampusInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createCampus(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDepartment = useCallback(async (input: CreateDepartmentInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createDepartment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWard = useCallback(async (input: CreateWardInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createWard(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHospitalBed = useCallback(async (input: CreateHospitalBedInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createHospitalBed(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPatientRegistration = useCallback(async (input: CreatePatientRegistrationInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createPatientRegistration(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPatientProfile = useCallback(async (input: CreatePatientProfileInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createPatientProfile(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMedicalHistory = useCallback(async (input: CreateMedicalHistoryInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createMedicalHistory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInsurancePolicy = useCallback(async (input: CreateInsurancePolicyInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createInsurancePolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAppointment = useCallback(async (input: CreateAppointmentInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createAppointment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOpdVisit = useCallback(async (input: CreateOpdVisitInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createOpdVisit(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIpdAdmission = useCallback(async (input: CreateIpdAdmissionInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createIpdAdmission(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createClinicalNote = useCallback(async (input: CreateClinicalNoteInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createClinicalNote(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPharmacyInventory = useCallback(async (input: CreatePharmacyInventoryInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createPharmacyInventory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPrescription = useCallback(async (input: CreatePrescriptionInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createPrescription(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLabOrder = useCallback(async (input: CreateLabOrderInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createLabOrder(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLabResult = useCallback(async (input: CreateLabResultInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createLabResult(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHospitalBilling = useCallback(async (input: CreateHospitalBillingInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createHospitalBilling(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInsuranceClaim = useCallback(async (input: CreateInsuranceClaimInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createInsuranceClaim(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHospitalInvoice = useCallback(async (input: CreateHospitalInvoiceInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createHospitalInvoice(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHospitalPayment = useCallback(async (input: CreateHospitalPaymentInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createHospitalPayment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPatientNotification = useCallback(async (input: CreatePatientNotificationInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createPatientNotification(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMedicalReport = useCallback(async (input: CreateMedicalReportInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createMedicalReport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPatientFeedback = useCallback(async (input: CreatePatientFeedbackInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createPatientFeedback(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAdmissionsAnalytics = useCallback(async (input: CreateAdmissionsAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createAdmissionsAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOccupancyAnalytics = useCallback(async (input: CreateOccupancyAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createOccupancyAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRevenueAnalytics = useCallback(async (input: CreateRevenueAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createRevenueAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHospitalMetric = useCallback(async (input: CreateHospitalMetricInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createHospitalMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHospitalHealth = useCallback(async (input: CreateHospitalHealthInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createHospitalHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExecutiveKpi = useCallback(async (input: CreateExecutiveKpiInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createExecutiveKpi(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createHospitalFailure = useCallback(async (input: CreateHospitalFailureInput) => { if (!user) throw new Error("Authentication required"); await hospitalService.createHospitalFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        hospitalHubs,
        createHospitalHub,
        campuses,
        createCampus,
        departments,
        createDepartment,
        wards,
        createWard,
        hospitalBeds,
        createHospitalBed,
        patientRegistrations,
        createPatientRegistration,
        patientProfiles,
        createPatientProfile,
        medicalHistories,
        createMedicalHistory,
        insurancePolicies,
        createInsurancePolicy,
        appointments,
        createAppointment,
        opdVisits,
        createOpdVisit,
        ipdAdmissions,
        createIpdAdmission,
        clinicalNotes,
        createClinicalNote,
        pharmacyInventory,
        createPharmacyInventory,
        prescriptions,
        createPrescription,
        labOrders,
        createLabOrder,
        labResults,
        createLabResult,
        hospitalBilling,
        createHospitalBilling,
        insuranceClaims,
        createInsuranceClaim,
        hospitalInvoices,
        createHospitalInvoice,
        hospitalPayments,
        createHospitalPayment,
        patientNotifications,
        createPatientNotification,
        medicalReports,
        createMedicalReport,
        patientFeedback,
        createPatientFeedback,
        patientRegistrationsAnalytics,
        createAdmissionsAnalytics,
        occupancyAnalytics,
        createOccupancyAnalytics,
        revenueAnalytics,
        createRevenueAnalytics,
        hospitalMetrics,
        createHospitalMetric,
        hospitalHealth,
        createHospitalHealth,
        executiveKpis,
        createExecutiveKpi,
        hospitalFailures,
        createHospitalFailure,
        auditLogs,
        hospitalHubOptions,
        refresh,
    };
}
